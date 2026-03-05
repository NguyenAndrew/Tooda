/**
 * make-gifs.js
 *
 * Generates animated GIFs of Tooda in action and saves them to docs/gifs/.
 *
 * Usage:
 *   npm run make-gifs
 *
 * The script builds the project, starts a temporary preview server, captures
 * browser screenshots at each key interaction, then encodes them into GIFs:
 *
 *   docs/gifs/c4-tabs.gif      — switching between C4 levels 1 → 2 → 3 → 4
 *   docs/gifs/c4-examples.gif  — switching between diagram examples
 *   docs/gifs/c4-toggle.gif    — toggling between Diagram and Code views
 */

import { chromium } from '@playwright/test';
import { createWriteStream, mkdirSync } from 'fs';
import { PNG } from 'pngjs';
import GIFEncoder from 'gif-encoder-2';
import { execSync, spawn } from 'child_process';
import { setTimeout as sleep } from 'timers/promises';

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const PORT = 4322;
const BASE_URL = `http://localhost:${PORT}`;
const BASE_PATH = '/Tooda';
const OUT_DIR = 'docs/gifs';
const VIEWPORT = { width: 1280, height: 720 };

/** Milliseconds each "hold" frame is shown in the output GIF. */
const FRAME_DELAY_MS = 900;

/** Number of identical frames to add after each interaction completes. */
const HOLD_FRAMES = 5;

/** Milliseconds to wait after an interaction before capturing frames. */
const SETTLE_MS = 300;

/** Number of frames to capture while the smooth-scroll animation is running. */
const SCROLL_FRAMES = 20;

/** Milliseconds between each scroll-animation frame capture. */
const SCROLL_INTERVAL_MS = 50;

/** Milliseconds each scroll-animation frame is shown in the GIF. */
const SCROLL_FRAME_DELAY_MS = 60;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

mkdirSync(OUT_DIR, { recursive: true });

/**
 * Captures the current page as a PNG and returns structured frame data
 * (width, height, and RGBA pixel data as a Uint8ClampedArray).
 * @param {import('@playwright/test').Page} page
 */
async function captureFrame(page) {
  const buf = await page.screenshot({ type: 'png' });
  const png = PNG.sync.read(buf);
  return {
    width: png.width,
    height: png.height,
    data: new Uint8ClampedArray(png.data.buffer, png.data.byteOffset, png.data.length),
  };
}

/**
 * Waits for the page to settle, scrolls the diagram inside the active tab
 * panel into view so the diagram fills the viewport, then pushes `count`
 * identical frames onto `frames` (repeating the same frame produces a "hold"
 * in the GIF).
 * @param {import('@playwright/test').Page} page
 * @param {Array<object>} frames
 * @param {number} count
 */
async function addHoldFrames(page, frames, count = HOLD_FRAMES) {
  await sleep(SETTLE_MS);
  await page.evaluate(() => {
    const panel = document.querySelector('.tab-panel.active');
    if (panel) {
      const diagram = panel.querySelector('.diagram-container') || panel;
      diagram.scrollIntoView({ behavior: 'instant', block: 'center' });
    }
  });
  const frame = await captureFrame(page);
  for (let i = 0; i < count; i++) frames.push(frame);
}

/**
 * Initiates a smooth scroll to the active tab panel's diagram, capturing
 * frames during the animation so the scroll is visible in the GIF, then
 * appends `count` hold frames at the final position.
 * @param {import('@playwright/test').Page} page
 * @param {Array<object>} frames
 * @param {number} count
 */
async function addScrollAndHoldFrames(page, frames, count = HOLD_FRAMES) {
  await sleep(SETTLE_MS);
  await page.evaluate(() => {
    // Reset to the top of the page so the smooth scroll to the diagram always
    // produces visible downward movement, regardless of the previous position.
    window.scrollTo({ top: 0, behavior: 'instant' });
    const panel = document.querySelector('.tab-panel.active');
    if (panel) {
      const diagram = panel.querySelector('.diagram-container') || panel;
      diagram.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
  // Brief pause so the browser has started the scroll animation before the
  // first frame is captured.
  await sleep(30);
  for (let i = 0; i < SCROLL_FRAMES; i++) {
    await sleep(SCROLL_INTERVAL_MS);
    const frame = await captureFrame(page);
    frames.push({ ...frame, delay: SCROLL_FRAME_DELAY_MS });
  }
  const holdFrame = await captureFrame(page);
  for (let i = 0; i < count; i++) frames.push(holdFrame);
}

/**
 * Shows a visual click indicator at the centre of `locator`, captures one
 * frame so the indicator is visible in the GIF, then removes the indicator
 * and performs the click.
 * @param {import('@playwright/test').Page} page
 * @param {Array<object>} frames
 * @param {import('@playwright/test').Locator} locator
 */
async function clickWithIndicator(page, frames, locator) {
  // Scroll the target element into view (instant, no animation) so that the
  // indicator overlay lands inside the visible viewport area.
  const handle = await locator.elementHandle();
  if (handle) {
    await page.evaluate(
      (el) => el.scrollIntoView({ behavior: 'instant', block: 'nearest' }),
      handle,
    );
  }

  const box = await locator.boundingBox();
  if (!box) throw new Error(`clickWithIndicator: element not visible or not in DOM`);
  const cx = box.x + box.width / 2;
  const cy = box.y + box.height / 2;

  await page.evaluate(({ cx, cy }) => {
    const el = document.createElement('div');
    el.id = '__click-indicator__';
    el.style.cssText = [
      'position:fixed',
      `left:${cx - 18}px`,
      `top:${cy - 18}px`,
      'width:36px',
      'height:36px',
      'border-radius:50%',
      'background:rgba(255,80,80,0.45)',
      'border:3px solid rgba(220,0,0,0.85)',
      'box-sizing:border-box',
      'z-index:2147483647',
      'pointer-events:none',
    ].join(';');
    document.body.appendChild(el);
  }, { cx, cy });

  const indicatorFrame = await captureFrame(page);
  frames.push(indicatorFrame);

  await page.evaluate(() => {
    const el = document.getElementById('__click-indicator__');
    if (el) el.remove();
  });

  await locator.click();
}

/**
 * Encodes an array of frames into an animated GIF and saves it to OUT_DIR.
 * @param {Array<{width: number, height: number, data: Uint8ClampedArray}>} frames
 * @param {string} filename
 * @param {number} frameDelay
 */
function saveGif(frames, filename, frameDelay = FRAME_DELAY_MS) {
  return new Promise((resolve, reject) => {
    if (!frames.length) return reject(new Error('No frames to encode'));
    const { width, height } = frames[0];
    const encoder = new GIFEncoder(width, height, 'neuquant', true, frames.length);
    const outputPath = `${OUT_DIR}/${filename}`;
    const out = createWriteStream(outputPath);
    encoder.createReadStream().pipe(out);
    encoder.start();
    encoder.setRepeat(0);
    encoder.setQuality(10);
    for (const frame of frames) {
      encoder.setDelay(frame.delay ?? frameDelay);
      encoder.addFrame(frame.data);
    }
    encoder.finish();
    out.on('finish', () => {
      console.log(`  ✓ ${outputPath}`);
      resolve();
    });
    out.on('error', reject);
  });
}

// ---------------------------------------------------------------------------
// GIF sequences
// ---------------------------------------------------------------------------

/**
 * C4 tab switching — Level 1 → 2 → 3 → 4.
 * @param {import('@playwright/test').Page} page
 */
async function makeC4TabsGif(page) {
  const frames = [];
  await page.goto(`${BASE_URL}${BASE_PATH}/c4`, { waitUntil: 'networkidle' });
  await page.waitForSelector('#level1 .mermaid svg', { state: 'visible' });
  await addScrollAndHoldFrames(page, frames);

  for (const { name, selector } of [
    { name: 'Level 2 \u2013 Container', selector: '#level2 .mermaid svg' },
    { name: 'Level 3 \u2013 Component', selector: '#level3 .mermaid svg' },
    { name: 'Level 4 \u2013 Code',      selector: '#level4 .mermaid svg' },
  ]) {
    await clickWithIndicator(page, frames, page.getByRole('link', { name, exact: true }));
    await page.waitForSelector(selector, { state: 'visible' });
    await addScrollAndHoldFrames(page, frames);
  }

  await saveGif(frames, 'c4-tabs.gif');
}

/**
 * Example switching — Online Banking → E-Commerce → Ride-Sharing → back.
 * @param {import('@playwright/test').Page} page
 */
async function makeC4ExamplesGif(page) {
  const frames = [];
  await page.goto(`${BASE_URL}${BASE_PATH}/c4`, { waitUntil: 'networkidle' });
  await page.waitForSelector('#level1 .mermaid svg', { state: 'visible' });
  await addScrollAndHoldFrames(page, frames);

  for (const name of ['E-Commerce', 'Ride-Sharing', 'Online Banking']) {
    await clickWithIndicator(page, frames, page.getByRole('link', { name, exact: true }));
    await page.waitForSelector('#level1 .mermaid svg', { state: 'visible' });
    await addScrollAndHoldFrames(page, frames);
  }

  await saveGif(frames, 'c4-examples.gif');
}

/**
 * Diagram / Code view toggle.
 * @param {import('@playwright/test').Page} page
 */
async function makeC4ToggleGif(page) {
  const frames = [];
  await page.goto(`${BASE_URL}${BASE_PATH}/c4`, { waitUntil: 'networkidle' });
  await page.waitForSelector('#level1 .mermaid svg', { state: 'visible' });
  await addHoldFrames(page, frames);

  await clickWithIndicator(page, frames, page.getByRole('link', { name: 'Code', exact: true }));
  await addHoldFrames(page, frames);

  await clickWithIndicator(page, frames, page.getByRole('link', { name: 'Diagram', exact: true }));
  await page.waitForSelector('#level1 .mermaid svg', { state: 'visible' });
  await addHoldFrames(page, frames);

  await saveGif(frames, 'c4-toggle.gif');
}

// ---------------------------------------------------------------------------
// Server lifecycle
// ---------------------------------------------------------------------------

/**
 * Polls `url` until it responds with a 2xx status.
 * @param {string} url
 * @param {number} retries
 * @param {number} intervalMs
 */
async function waitForServer(url, retries = 30, intervalMs = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch {
      // server not ready yet
    }
    await sleep(intervalMs);
  }
  throw new Error(`Server at ${url} did not become ready in time`);
}

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

async function main() {
  console.log('Building project...');
  execSync('node scripts/copy-mermaid.js && npx astro build', { stdio: 'inherit' });

  console.log(`Starting preview server on port ${PORT}...`);
  const cmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';
  const server = spawn(cmd, ['astro', 'preview', '--port', String(PORT)], {
    stdio: 'ignore',
  });

  try {
    await waitForServer(`${BASE_URL}${BASE_PATH}/`);
    console.log('Server ready. Generating GIFs...\n');

    const browser = await chromium.launch();
    try {
      const page = await browser.newPage();
      await page.setViewportSize(VIEWPORT);

      await makeC4TabsGif(page);
      await makeC4ExamplesGif(page);
      await makeC4ToggleGif(page);

      await page.close();
    } finally {
      await browser.close();
    }

    console.log(`\nDone! GIFs saved to ${OUT_DIR}/`);
  } finally {
    server.kill();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

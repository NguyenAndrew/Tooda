/**
 * generate-healthcare-pngs.js
 *
 * Generates PNG exports of the Healthcare Platform diagrams for the API endpoints.
 *
 * Usage:
 *   npm run generate-healthcare-pngs
 *
 * The script builds the project, starts a temporary preview server, captures
 * browser screenshots of each healthcare diagram level in both renderers,
 * then saves them as static PNG files served under /api/healthcare/:
 *
 *   public/api/healthcare/excalidraw/level1.png  — Level 1 Excalidraw view
 *   public/api/healthcare/excalidraw/level2.png  — Level 2 Excalidraw view
 *   public/api/healthcare/excalidraw/level3.png  — Level 3 Excalidraw view
 *   public/api/healthcare/excalidraw/level4.png  — Level 4 Excalidraw view
 *   public/api/healthcare/mermaid/level1.png     — Level 1 Mermaid view
 *   public/api/healthcare/mermaid/level2.png     — Level 2 Mermaid view
 *   public/api/healthcare/mermaid/level3.png     — Level 3 Mermaid view
 *   public/api/healthcare/mermaid/level4.png     — Level 4 Mermaid view
 */

import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'fs';
import { execSync, spawn } from 'child_process';
import { setTimeout as sleep } from 'timers/promises';

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const PORT = 4324;
const BASE_URL = `http://localhost:${PORT}`;
const BASE_PATH = '/Tooda';
const VIEWPORT = { width: 1280, height: 800 };

const LEVELS = ['level1', 'level2', 'level3', 'level4'];

const EXCALIDRAW_OUT = 'public/api/healthcare/excalidraw';
const MERMAID_OUT = 'public/api/healthcare/mermaid';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

mkdirSync(EXCALIDRAW_OUT, { recursive: true });
mkdirSync(MERMAID_OUT, { recursive: true });

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

/**
 * Captures a PNG of the Excalidraw diagram for the given level.
 * @param {import('@playwright/test').Page} page
 * @param {string} level  e.g. 'level1'
 * @returns {Promise<Buffer>}
 */
async function captureExcalidrawPng(page, level) {
  await page.goto(
    `${BASE_URL}${BASE_PATH}/excalidraw?renderer=excalidraw#${level}`,
    { waitUntil: 'networkidle' },
  );
  await page.waitForSelector(`#${level} .excalidraw`, {
    state: 'visible',
    timeout: 30000,
  });
  return page.locator(`#${level} .diagram-wrapper`).screenshot({ type: 'png' });
}

/**
 * Captures a PNG of the Mermaid diagram for the given level.
 * @param {import('@playwright/test').Page} page
 * @param {string} level  e.g. 'level1'
 * @returns {Promise<Buffer>}
 */
async function captureMermaidPng(page, level) {
  await page.goto(
    `${BASE_URL}${BASE_PATH}/excalidraw?renderer=mermaid#${level}`,
    { waitUntil: 'networkidle' },
  );
  await page.waitForSelector(`#${level} .mermaid-view svg`, {
    state: 'visible',
    timeout: 30000,
  });
  return page.locator(`#${level} .mermaid-wrapper`).screenshot({ type: 'png' });
}

// ---------------------------------------------------------------------------
// Main capture sequence
// ---------------------------------------------------------------------------

/**
 * Navigates through all four levels in both renderers and writes PNG files.
 * @param {import('@playwright/test').Page} page
 */
async function captureAllPngs(page) {
  for (const level of LEVELS) {
    console.log(`  Capturing Excalidraw ${level}...`);
    const excalidrawPng = await captureExcalidrawPng(page, level);
    const excalidrawPath = `${EXCALIDRAW_OUT}/${level}.png`;
    writeFileSync(excalidrawPath, excalidrawPng);
    console.log(`  ✓ ${excalidrawPath}`);

    console.log(`  Capturing Mermaid ${level}...`);
    const mermaidPng = await captureMermaidPng(page, level);
    const mermaidPath = `${MERMAID_OUT}/${level}.png`;
    writeFileSync(mermaidPath, mermaidPng);
    console.log(`  ✓ ${mermaidPath}`);
  }
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
    console.log('Server ready. Generating Healthcare PNGs...\n');

    const browser = await chromium.launch();
    try {
      const page = await browser.newPage();
      await page.setViewportSize(VIEWPORT);

      await captureAllPngs(page);

      await page.close();
    } finally {
      await browser.close();
    }

    console.log(`\nDone! PNGs saved to ${EXCALIDRAW_OUT}/ and ${MERMAID_OUT}/`);
  } finally {
    server.kill();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

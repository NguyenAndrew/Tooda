import { test, expect, type Page } from '@playwright/test';

const PAGES = [
  { name: 'Home', path: '/Tooda/' },
  { name: 'C4 Diagrams', path: '/Tooda/c4' },
  { name: 'Excalidraw', path: '/Tooda/excalidraw' },
];

const VIEWPORTS = [
  { label: 'mobile', width: 375, height: 667 },
  { label: 'tablet', width: 768, height: 1024 },
  { label: 'desktop', width: 1280, height: 800 },
];

// 3 000 ms is a commonly accepted "good" Time-to-Interactive budget aligned with
// Google Core Web Vitals (LCP ≤ 2 500 ms) plus a small buffer for test variance.
const LOAD_TIME_THRESHOLD_MS = 3000;

// Navigation links on the Home page and the page they lead to.
const HOME_NAV_LINKS = [
  { name: 'Online Banking', label: /Online Banking/, destination: 'C4 Diagrams' },
  { name: 'E-Commerce', label: /E-Commerce/, destination: 'C4 Diagrams' },
  { name: 'Ride-Sharing', label: /Ride-Sharing/, destination: 'C4 Diagrams' },
  { name: 'Healthcare', label: /Healthcare/, destination: 'Excalidraw' },
];

async function getNavigationLoadTime(page: Page): Promise<number | null> {
  // loadEventEnd may be 0 immediately after the load event fires because the
  // Performance API updates it asynchronously. Wait until it is populated before
  // reading the measurement to prevent false-zero results.
  try {
    await page.waitForFunction(() => {
      const [entry] = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
      return entry != null && entry.loadEventEnd > 0;
    });
  } catch {
    return null;
  }
  return page.evaluate(() => {
    const [entry] = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
    return entry && entry.loadEventEnd > 0 ? entry.loadEventEnd - entry.startTime : null;
  });
}

test.describe('Performance – page load times', () => {
  for (const { name, path } of PAGES) {
    test(`${name} page loads within ${LOAD_TIME_THRESHOLD_MS} ms`, async ({ page }) => {
      await page.goto(path, { waitUntil: 'load' });

      const navigationTiming = await getNavigationLoadTime(page);

      expect(navigationTiming).not.toBeNull();
      expect(navigationTiming!).toBeLessThan(LOAD_TIME_THRESHOLD_MS);
    });
  }
});

test.describe('Performance – navigation from Home', () => {
  for (const { name, label, destination } of HOME_NAV_LINKS) {
    test(`navigating from Home via "${name}" link to ${destination} page loads within ${LOAD_TIME_THRESHOLD_MS} ms`, async ({ page }) => {
      await page.goto('/Tooda/', { waitUntil: 'load' });

      // Wait for the network to settle so viewport-based prefetch can complete.
      await page.waitForLoadState('networkidle');

      // Capture the home URL before clicking so we can detect when navigation away
      // has completed. Using waitForURL with a predicate avoids the race where
      // waitForLoadState('load') resolves immediately (page is already loaded).
      const homeUrl = page.url();
      await Promise.all([
        page.waitForURL(url => url.href !== homeUrl, { waitUntil: 'load' }),
        page.getByRole('link', { name: label }).click(),
      ]);

      const navigationTiming = await getNavigationLoadTime(page);

      expect(navigationTiming).not.toBeNull();
      expect(navigationTiming!).toBeLessThan(LOAD_TIME_THRESHOLD_MS);
    });
  }
});

test.describe('Performance – responsiveness', () => {
  for (const { label, width, height } of VIEWPORTS) {
    test.describe(`${label} viewport (${width}×${height})`, () => {
      test('Home page renders key elements', async ({ page }) => {
        await page.setViewportSize({ width, height });
        await page.goto('/Tooda/');
        await expect(page.getByRole('heading', { name: 'Tooda' })).toBeVisible();
        await expect(page.getByRole('link', { name: /Online Banking/ })).toBeVisible();
        await expect(page.getByRole('link', { name: /E-Commerce/ })).toBeVisible();
        await expect(page.getByRole('link', { name: /Ride-Sharing/ })).toBeVisible();
        await expect(page.getByRole('link', { name: /Healthcare/ })).toBeVisible();
      });

      test('C4 Diagrams page renders key elements', async ({ page }) => {
        await page.setViewportSize({ width, height });
        await page.goto('/Tooda/c4');
        await expect(page.getByRole('link', { name: 'Level 1 – Context' })).toBeVisible();
        await expect(page.getByRole('link', { name: 'Level 2 – Container' })).toBeVisible();
        await expect(page.getByRole('link', { name: 'Level 3 – Component' })).toBeVisible();
        await expect(page.getByRole('link', { name: 'Level 4 – Code' })).toBeVisible();
        await expect(page.getByRole('link', { name: /Back to Home/ })).toBeVisible();
      });

      test('Excalidraw page renders key elements', async ({ page }) => {
        await page.setViewportSize({ width, height });
        await page.goto('/Tooda/excalidraw');
        await expect(page.getByRole('heading', { name: 'Healthcare Platform' })).toBeVisible();
        await expect(page.getByRole('link', { name: 'Level 1 – Context' })).toBeVisible();
        await expect(page.getByRole('link', { name: /Back to Home/ })).toBeVisible();
      });
    });
  }
});

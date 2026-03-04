import { test, expect } from '@playwright/test';

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

test.describe('Performance – page load times', () => {
  for (const { name, path } of PAGES) {
    test(`${name} page loads within ${LOAD_TIME_THRESHOLD_MS} ms`, async ({ page }) => {
      await page.goto(path, { waitUntil: 'load' });

      const navigationTiming = await page.evaluate(() => {
        const [entry] = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
        return entry ? entry.loadEventEnd - entry.startTime : null;
      });

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

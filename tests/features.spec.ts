import { test, expect } from '@playwright/test';

test.describe('Home page – Features link', () => {
  test('has a link to the features page', async ({ page }) => {
    await page.goto('/Tooda/');
    await expect(page.getByRole('link', { name: /View All Features/ })).toHaveAttribute('href', '/Tooda/features');
  });

  test('Features link is visible on mobile without scrolling to footer', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/Tooda/');
    const link = page.getByRole('link', { name: /View All Features/ });
    await expect(link).toBeVisible();
  });
});

test.describe('Home page – Features link mobile tap', () => {
  test.use({ hasTouch: true });

  test('Features link is clickable on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/Tooda/');
    const link = page.getByRole('link', { name: /View All Features/ });
    await Promise.all([
      page.waitForURL(/\/Tooda\/features/),
      link.tap(),
    ]);
  });
});

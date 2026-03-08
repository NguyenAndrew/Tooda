import { test, expect } from '@playwright/test';

test.describe('Features page', () => {
  test('has correct title', async ({ page }) => {
    await page.goto('/Tooda/features');
    await expect(page).toHaveTitle('Features | Tooda');
  });

  test('displays the main heading', async ({ page }) => {
    await page.goto('/Tooda/features');
    await expect(page.getByRole('heading', { name: 'Features' })).toBeVisible();
  });

  test('renders the Three.js canvas container', async ({ page }) => {
    await page.goto('/Tooda/features');
    await expect(page.getByTestId('three-canvas-container')).toBeVisible();
  });

  test('renders a WebGL canvas inside the container', async ({ page }) => {
    await page.goto('/Tooda/features');
    await page.waitForSelector('[data-testid="three-canvas-container"] canvas', { timeout: 10000 });
    await expect(page.locator('[data-testid="three-canvas-container"] canvas')).toBeVisible();
  });

  test('has a back link to home in the footer', async ({ page }) => {
    await page.goto('/Tooda/features');
    const backLink = page.getByRole('link', { name: /Back to Home/ });
    await expect(backLink).toBeVisible();
    await expect(backLink).toHaveAttribute('href', '/Tooda/');
  });

  test('displays the hint text', async ({ page }) => {
    await page.goto('/Tooda/features');
    await expect(page.getByText(/Drag to rotate/)).toBeVisible();
    await expect(page.getByText(/Tap a node to navigate/)).toBeVisible();
  });
});

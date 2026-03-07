import { test, expect } from '@playwright/test';

test.describe('3D Features page', () => {
  test('has correct title', async ({ page }) => {
    await page.goto('/Tooda/features-3d');
    await expect(page).toHaveTitle('3D Features | Tooda');
  });

  test('displays the main heading', async ({ page }) => {
    await page.goto('/Tooda/features-3d');
    await expect(page.getByRole('heading', { name: '3D Features' })).toBeVisible();
  });

  test('renders the Three.js canvas container', async ({ page }) => {
    await page.goto('/Tooda/features-3d');
    await expect(page.getByTestId('three-canvas-container')).toBeVisible();
  });

  test('renders a WebGL canvas inside the container', async ({ page }) => {
    await page.goto('/Tooda/features-3d');
    await page.waitForSelector('[data-testid="three-canvas-container"] canvas', { timeout: 10000 });
    await expect(page.locator('[data-testid="three-canvas-container"] canvas')).toBeVisible();
  });

  test('has a back link to the features page', async ({ page }) => {
    await page.goto('/Tooda/features-3d');
    const backLink = page.getByRole('link', { name: /Back to Features/ });
    await expect(backLink).toBeVisible();
    await expect(backLink).toHaveAttribute('href', '/Tooda/features');
  });

  test('has a link to the features page in the footer', async ({ page }) => {
    await page.goto('/Tooda/features-3d');
    const link = page.getByRole('link', { name: /View All Features/ });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute('href', '/Tooda/features');
  });

  test('has a back link to home in the footer', async ({ page }) => {
    await page.goto('/Tooda/features-3d');
    const backLink = page.getByRole('link', { name: /Back to Home/ });
    await expect(backLink).toBeVisible();
    await expect(backLink).toHaveAttribute('href', '/Tooda/');
  });

  test('displays the hint text', async ({ page }) => {
    await page.goto('/Tooda/features-3d');
    await expect(page.getByText(/Drag to rotate/)).toBeVisible();
    await expect(page.getByText(/Tap a node to navigate/)).toBeVisible();
  });
});

test.describe('Features page – 3D Visualization link', () => {
  test('has a link to the 3D visualization', async ({ page }) => {
    await page.goto('/Tooda/features');
    await expect(page.getByRole('link', { name: /3D Visualization/ })).toHaveAttribute('href', '/Tooda/features-3d');
  });
});

test.describe('Home page – 3D Visualization card', () => {
  test('has a link to the 3D visualization page', async ({ page }) => {
    await page.goto('/Tooda/');
    await expect(page.getByRole('link', { name: /3D Visualization/ }).first()).toHaveAttribute('href', '/Tooda/features-3d');
  });
});

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

  test('displays C4 Model Diagrams section', async ({ page }) => {
    await page.goto('/Tooda/features');
    await expect(page.getByRole('heading', { name: 'C4 Model Diagrams' })).toBeVisible();
  });

  test('displays Freehand Diagrams section', async ({ page }) => {
    await page.goto('/Tooda/features');
    await expect(page.getByRole('heading', { name: 'Freehand Diagrams' })).toBeVisible();
  });

  test('displays API Explorer section', async ({ page }) => {
    await page.goto('/Tooda/features');
    await expect(page.getByRole('heading', { name: 'API Explorer' })).toBeVisible();
  });

  test('displays Platform section', async ({ page }) => {
    await page.goto('/Tooda/features');
    await expect(page.getByRole('heading', { name: 'Platform' })).toBeVisible();
  });

  test('has links to C4 diagram examples', async ({ page }) => {
    await page.goto('/Tooda/features');
    await expect(page.getByRole('link', { name: /Online Banking/ })).toHaveAttribute('href', '/Tooda/c4?example=banking');
    await expect(page.getByRole('link', { name: /E-Commerce/ })).toHaveAttribute('href', '/Tooda/c4?example=ecommerce');
    await expect(page.getByRole('link', { name: /Ride-Sharing/ })).toHaveAttribute('href', '/Tooda/c4?example=ridesharing');
    await expect(page.getByRole('link', { name: /Tooda/ })).toHaveAttribute('href', '/Tooda/c4?example=tooda');
  });

  test('has a link to the Excalidraw example', async ({ page }) => {
    await page.goto('/Tooda/features');
    await expect(page.getByRole('link', { name: /Healthcare Platform/ })).toHaveAttribute('href', '/Tooda/excalidraw');
  });

  test('has a link to the API Explorer', async ({ page }) => {
    await page.goto('/Tooda/features');
    await expect(page.getByRole('link', { name: /Open API Explorer/ })).toHaveAttribute('href', '/Tooda/api');
  });

  test('has a back link to the home page', async ({ page }) => {
    await page.goto('/Tooda/features');
    const backLinks = page.getByRole('link', { name: /Back to Home/ });
    await expect(backLinks.first()).toHaveAttribute('href', '/Tooda/');
  });
});

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

import { test, expect } from '@playwright/test';

test.describe('Home page', () => {
  test('has correct title', async ({ page }) => {
    await page.goto('/Tooda/');
    await expect(page).toHaveTitle('Tooda');
  });

  test('displays the main heading', async ({ page }) => {
    await page.goto('/Tooda/');
    await expect(page.getByRole('heading', { name: 'Tooda' })).toBeVisible();
  });

  test('has links to each C4 diagram example', async ({ page }) => {
    await page.goto('/Tooda/');
    const bankingLink = page.getByRole('link', { name: /Online Banking/ });
    await expect(bankingLink).toBeVisible();
    await expect(bankingLink).toHaveAttribute('href', '/Tooda/c4?example=banking');

    const ecommerceLink = page.getByRole('link', { name: /E-Commerce/ });
    await expect(ecommerceLink).toBeVisible();
    await expect(ecommerceLink).toHaveAttribute('href', '/Tooda/c4?example=ecommerce');

    const ridesharingLink = page.getByRole('link', { name: /Ride-Sharing/ });
    await expect(ridesharingLink).toBeVisible();
    await expect(ridesharingLink).toHaveAttribute('href', '/Tooda/c4?example=ridesharing');

    const healthcareLink = page.getByRole('link', { name: /Healthcare/ });
    await expect(healthcareLink).toBeVisible();
    await expect(healthcareLink).toHaveAttribute('href', '/Tooda/excalidraw');
  });

  test('has a link to the GitHub repository', async ({ page }) => {
    await page.goto('/Tooda/');
    const githubLink = page.getByRole('link', { name: /View on GitHub/ });
    await expect(githubLink).toBeVisible();
    await expect(githubLink).toHaveAttribute('href', 'https://github.com/NguyenAndrew/Tooda');
  });
});

test.describe('Home page – mobile viewport button functionality', () => {
  test.use({ hasTouch: true });
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/Tooda/');
  });

  test('Online Banking button is clickable on mobile', async ({ page }) => {
    const link = page.getByRole('link', { name: /Online Banking/ });
    await expect(link).toBeVisible();
    await Promise.all([
      page.waitForURL(/\/Tooda\/c4/),
      link.tap(),
    ]);
  });

  test('E-Commerce button is clickable on mobile', async ({ page }) => {
    const link = page.getByRole('link', { name: /E-Commerce/ });
    await expect(link).toBeVisible();
    await Promise.all([
      page.waitForURL(/\/Tooda\/c4/),
      link.tap(),
    ]);
  });

  test('Ride-Sharing button is clickable on mobile', async ({ page }) => {
    const link = page.getByRole('link', { name: /Ride-Sharing/ });
    await expect(link).toBeVisible();
    await Promise.all([
      page.waitForURL(/\/Tooda\/c4/),
      link.tap(),
    ]);
  });

  test('Healthcare (Excalidraw) button is clickable on mobile', async ({ page }) => {
    const link = page.getByRole('link', { name: /Healthcare/ });
    await expect(link).toBeVisible();
    await Promise.all([
      page.waitForURL(/\/Tooda\/excalidraw/),
      link.tap(),
    ]);
  });

  test('API Explorer button is clickable on mobile', async ({ page }) => {
    const link = page.getByRole('link', { name: /API Explorer/ });
    await expect(link).toBeVisible();
    await Promise.all([
      page.waitForURL(/\/Tooda\/api/),
      link.tap(),
    ]);
  });
});

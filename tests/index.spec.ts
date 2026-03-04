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
});

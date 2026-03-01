import { test, expect } from '@playwright/test';

test.describe('Home page', () => {
  test('has correct title', async ({ page }) => {
    await page.goto('/Tooda/');
    await expect(page).toHaveTitle('Hello World | Tooda');
  });

  test('displays the main heading', async ({ page }) => {
    await page.goto('/Tooda/');
    await expect(page.getByRole('heading', { name: 'Hello, World!' })).toBeVisible();
  });

  test('has a link to the C4 diagram page', async ({ page }) => {
    await page.goto('/Tooda/');
    const cta = page.getByRole('link', { name: /View C4 Diagram Example/ });
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute('href', '/Tooda/c4');
  });
});

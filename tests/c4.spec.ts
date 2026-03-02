import { test, expect } from '@playwright/test';

test.describe('C4 diagram page', () => {
  test('has correct title', async ({ page }) => {
    await page.goto('/Tooda/c4');
    await expect(page).toHaveTitle('C4 Diagrams | Tooda');
  });

  test('displays all four tab buttons', async ({ page }) => {
    await page.goto('/Tooda/c4');
    await expect(page.getByRole('button', { name: 'Level 1 – Context' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Level 2 – Container' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Level 3 – Component' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Level 4 – Code' })).toBeVisible();
  });

  test('Level 1 panel is active by default', async ({ page }) => {
    await page.goto('/Tooda/c4');
    await expect(page.getByRole('button', { name: 'Level 1 – Context' })).toHaveClass(/active/);
    await expect(page.locator('#level1')).toHaveClass(/active/);
  });

  test('clicking Level 2 tab activates its panel', async ({ page }) => {
    await page.goto('/Tooda/c4');
    await page.getByRole('button', { name: 'Level 2 – Container' }).click();
    await expect(page.locator('#level2')).toHaveClass(/active/);
    await expect(page.locator('#level1')).not.toHaveClass(/active/);
  });

  test('clicking Level 3 tab activates its panel', async ({ page }) => {
    await page.goto('/Tooda/c4');
    await page.getByRole('button', { name: 'Level 3 – Component' }).click();
    await expect(page.locator('#level3')).toHaveClass(/active/);
  });

  test('clicking Level 4 tab activates its panel', async ({ page }) => {
    await page.goto('/Tooda/c4');
    await page.getByRole('button', { name: 'Level 4 – Code' }).click();
    await expect(page.locator('#level4')).toHaveClass(/active/);
  });

  test('Level 4 diagram renders without errors', async ({ page }) => {
    await page.goto('/Tooda/c4');
    await page.getByRole('button', { name: 'Level 4 – Code' }).click();
    await page.waitForSelector('#level4 .mermaid svg', { state: 'visible' });
    await expect(page.locator('#level4 .mermaid')).not.toContainText('Syntax error');
  });

  test('has a back link to the home page', async ({ page }) => {
    await page.goto('/Tooda/c4');
    const back = page.getByRole('link', { name: /Back to Home/ });
    await expect(back).toBeVisible();
    await expect(back).toHaveAttribute('href', '/Tooda/');
  });
});

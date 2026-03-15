import { test, expect } from '@playwright/test';

test.describe('C4 export PNG – Mermaid renderer', () => {
  test('Export PNG button triggers a PNG download for Mermaid renderer', async ({ page }) => {
    await page.goto('/Tooda/c4?renderer=mermaid');

    // Wait until Mermaid has rendered an SVG into the active panel
    await page.waitForSelector('#level1 .mermaid-view svg', { timeout: 15000 });

    const downloadPromise = page.waitForEvent('download');
    await page.getByTestId('export-png-btn').click();
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toMatch(/\.png$/);
  });
});

test.describe('C4 diagram page', () => {
  test('has correct title', async ({ page }) => {
    await page.goto('/Tooda/c4');
    await expect(page).toHaveTitle('C4 Diagrams | Tooda');
  });

  test('displays all four tab links', async ({ page }) => {
    await page.goto('/Tooda/c4');
    await expect(page.getByRole('link', { name: 'Level 1 – Context' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Level 2 – Container' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Level 3 – Component' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Level 4 – Code' })).toBeVisible();
  });

  test('Level 1 panel is active by default', async ({ page }) => {
    await page.goto('/Tooda/c4');
    await expect(page.getByRole('link', { name: 'Level 1 – Context' })).toHaveClass(/active/);
    await expect(page.locator('#level1')).toHaveClass(/active/);
  });

  test('clicking Level 2 tab activates its panel', async ({ page }) => {
    await page.goto('/Tooda/c4');
    await page.getByRole('link', { name: 'Level 2 – Container' }).click();
    await expect(page.locator('#level2')).toHaveClass(/active/);
    await expect(page.locator('#level1')).not.toHaveClass(/active/);
  });

  test('clicking Level 3 tab activates its panel', async ({ page }) => {
    await page.goto('/Tooda/c4');
    await page.getByRole('link', { name: 'Level 3 – Component' }).click();
    await expect(page.locator('#level3')).toHaveClass(/active/);
  });

  test('clicking Level 4 tab activates its panel', async ({ page }) => {
    await page.goto('/Tooda/c4');
    await page.getByRole('link', { name: 'Level 4 – Code' }).click();
    await expect(page.locator('#level4')).toHaveClass(/active/);
  });

  test('has a back link to the home page', async ({ page }) => {
    await page.goto('/Tooda/c4');
    const back = page.getByRole('link', { name: /Back to Home/ });
    await expect(back).toBeVisible();
    await expect(back).toHaveAttribute('href', '/Tooda/');
  });

  test('displays all five example selector links', async ({ page }) => {
    await page.goto('/Tooda/c4');
    await expect(page.getByRole('link', { name: 'Online Banking' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'E-Commerce' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Ride-Sharing' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Tooda' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Healthcare' })).toBeVisible();
  });

  test('Online Banking example is active by default', async ({ page }) => {
    await page.goto('/Tooda/c4');
    await expect(page.getByRole('link', { name: 'Online Banking' })).toHaveClass(/active/);
  });

  test('clicking E-Commerce example activates its link', async ({ page }) => {
    await page.goto('/Tooda/c4');
    await page.getByRole('link', { name: 'E-Commerce' }).click();
    await expect(page.getByRole('link', { name: 'E-Commerce' })).toHaveClass(/active/);
    await expect(page.getByRole('link', { name: 'Online Banking' })).not.toHaveClass(/active/);
  });

  test('clicking Ride-Sharing example activates its link', async ({ page }) => {
    await page.goto('/Tooda/c4');
    await page.getByRole('link', { name: 'Ride-Sharing' }).click();
    await expect(page.getByRole('link', { name: 'Ride-Sharing' })).toHaveClass(/active/);
    await expect(page.getByRole('link', { name: 'Online Banking' })).not.toHaveClass(/active/);
  });

  test('switching to E-Commerce example shows its Level 1 excalidraw wrapper', async ({ page }) => {
    await page.goto('/Tooda/c4');
    await page.getByRole('link', { name: 'E-Commerce' }).click();
    await expect(page.locator('#level1 .excalidraw-wrapper[data-example="ecommerce"]')).toBeVisible();
    await expect(page.locator('#level1 .excalidraw-wrapper[data-example="banking"]')).toBeHidden();
  });

  test('switching to Ride-Sharing example shows its Level 1 excalidraw wrapper', async ({ page }) => {
    await page.goto('/Tooda/c4');
    await page.getByRole('link', { name: 'Ride-Sharing' }).click();
    await expect(page.locator('#level1 .excalidraw-wrapper[data-example="ridesharing"]')).toBeVisible();
    await expect(page.locator('#level1 .excalidraw-wrapper[data-example="banking"]')).toBeHidden();
  });

  test('navigating to ?example=ecommerce activates E-Commerce example', async ({ page }) => {
    await page.goto('/Tooda/c4?example=ecommerce');
    await expect(page.getByRole('link', { name: 'E-Commerce' })).toHaveClass(/active/);
    await expect(page.getByRole('link', { name: 'Online Banking' })).not.toHaveClass(/active/);
  });

  test('navigating to ?example=ridesharing activates Ride-Sharing example', async ({ page }) => {
    await page.goto('/Tooda/c4?example=ridesharing');
    await expect(page.getByRole('link', { name: 'Ride-Sharing' })).toHaveClass(/active/);
    await expect(page.getByRole('link', { name: 'Online Banking' })).not.toHaveClass(/active/);
  });

  test('clicking example link updates URL query parameter', async ({ page }) => {
    await page.goto('/Tooda/c4');
    await page.getByRole('link', { name: 'E-Commerce' }).click();
    await expect(page).toHaveURL(/example=ecommerce/);
  });

  test('clicking Tooda example activates its link', async ({ page }) => {
    await page.goto('/Tooda/c4');
    await page.getByRole('link', { name: 'Tooda' }).click();
    await expect(page.getByRole('link', { name: 'Tooda' })).toHaveClass(/active/);
    await expect(page.getByRole('link', { name: 'Online Banking' })).not.toHaveClass(/active/);
  });

  test('switching to Tooda example shows its Level 1 excalidraw wrapper', async ({ page }) => {
    await page.goto('/Tooda/c4');
    await page.getByRole('link', { name: 'Tooda' }).click();
    await expect(page.locator('#level1 .excalidraw-wrapper[data-example="tooda"]')).toBeVisible();
    await expect(page.locator('#level1 .excalidraw-wrapper[data-example="banking"]')).toBeHidden();
  });

  test('navigating to ?example=tooda activates Tooda example', async ({ page }) => {
    await page.goto('/Tooda/c4?example=tooda');
    await expect(page.getByRole('link', { name: 'Tooda' })).toHaveClass(/active/);
    await expect(page.getByRole('link', { name: 'Online Banking' })).not.toHaveClass(/active/);
  });

  test('Online Banking excalidraw wrapper is visible by default in Level 1', async ({ page }) => {
    await page.goto('/Tooda/c4');
    await expect(page.locator('#level1 .excalidraw-wrapper[data-example="banking"]')).toBeVisible();
    await expect(page.locator('#level1 .excalidraw-wrapper[data-example="ecommerce"]')).toBeHidden();
    await expect(page.locator('#level1 .excalidraw-wrapper[data-example="ridesharing"]')).toBeHidden();
    await expect(page.locator('#level1 .excalidraw-wrapper[data-example="tooda"]')).toBeHidden();
    await expect(page.locator('#level1 .excalidraw-wrapper[data-example="healthcare"]')).toBeHidden();
  });

  test('clicking Healthcare example activates its link', async ({ page }) => {
    await page.goto('/Tooda/c4');
    await page.getByRole('link', { name: 'Healthcare' }).click();
    await expect(page.getByRole('link', { name: 'Healthcare' })).toHaveClass(/active/);
    await expect(page.getByRole('link', { name: 'Online Banking' })).not.toHaveClass(/active/);
  });

  test('switching to Healthcare example shows its Level 1 excalidraw wrapper', async ({ page }) => {
    await page.goto('/Tooda/c4');
    await page.getByRole('link', { name: 'Healthcare' }).click();
    await expect(page.locator('#level1 .excalidraw-wrapper[data-example="healthcare"]')).toBeVisible();
    await expect(page.locator('#level1 .excalidraw-wrapper[data-example="banking"]')).toBeHidden();
  });

  test('navigating to ?example=healthcare activates Healthcare example', async ({ page }) => {
    await page.goto('/Tooda/c4?example=healthcare');
    await expect(page.getByRole('link', { name: 'Healthcare' })).toHaveClass(/active/);
    await expect(page.getByRole('link', { name: 'Online Banking' })).not.toHaveClass(/active/);
  });

});

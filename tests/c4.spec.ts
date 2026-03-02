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

  test('displays all three example selector buttons', async ({ page }) => {
    await page.goto('/Tooda/c4');
    await expect(page.getByRole('button', { name: 'Online Banking' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'E-Commerce' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Ride-Sharing' })).toBeVisible();
  });

  test('Online Banking example is active by default', async ({ page }) => {
    await page.goto('/Tooda/c4');
    await expect(page.getByRole('button', { name: 'Online Banking' })).toHaveClass(/active/);
  });

  test('clicking E-Commerce example activates its button', async ({ page }) => {
    await page.goto('/Tooda/c4');
    await page.getByRole('button', { name: 'E-Commerce' }).click();
    await expect(page.getByRole('button', { name: 'E-Commerce' })).toHaveClass(/active/);
    await expect(page.getByRole('button', { name: 'Online Banking' })).not.toHaveClass(/active/);
  });

  test('clicking Ride-Sharing example activates its button', async ({ page }) => {
    await page.goto('/Tooda/c4');
    await page.getByRole('button', { name: 'Ride-Sharing' }).click();
    await expect(page.getByRole('button', { name: 'Ride-Sharing' })).toHaveClass(/active/);
    await expect(page.getByRole('button', { name: 'Online Banking' })).not.toHaveClass(/active/);
  });

  test('switching to E-Commerce example updates the Level 1 diagram', async ({ page }) => {
    await page.goto('/Tooda/c4');
    await page.getByRole('button', { name: 'E-Commerce' }).click();
    await page.waitForSelector('#level1 .mermaid svg', { state: 'visible' });
    await expect(page.locator('#level1 .mermaid')).not.toContainText('Syntax error');
  });

  test('switching to Ride-Sharing example updates the Level 1 diagram', async ({ page }) => {
    await page.goto('/Tooda/c4');
    await page.getByRole('button', { name: 'Ride-Sharing' }).click();
    await page.waitForSelector('#level1 .mermaid svg', { state: 'visible' });
    await expect(page.locator('#level1 .mermaid')).not.toContainText('Syntax error');
  });

  test('displays Diagram and Code view toggle buttons', async ({ page }) => {
    await page.goto('/Tooda/c4');
    await expect(page.getByRole('button', { name: 'Diagram', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Code', exact: true })).toBeVisible();
  });

  test('Diagram view is active by default', async ({ page }) => {
    await page.goto('/Tooda/c4');
    await expect(page.getByRole('button', { name: 'Diagram', exact: true })).toHaveClass(/active/);
    await expect(page.getByRole('button', { name: 'Code', exact: true })).not.toHaveClass(/active/);
  });

  test('diagram is visible and code is hidden by default', async ({ page }) => {
    await page.goto('/Tooda/c4');
    await expect(page.locator('#level1 .diagram-container')).toBeVisible();
    await expect(page.locator('#level1 .code-container')).toBeHidden();
  });

  test('clicking Code button shows code and hides diagram', async ({ page }) => {
    await page.goto('/Tooda/c4');
    await page.getByRole('button', { name: 'Code', exact: true }).click();
    await expect(page.getByRole('button', { name: 'Code', exact: true })).toHaveClass(/active/);
    await expect(page.locator('#level1 .code-container')).toBeVisible();
    await expect(page.locator('#level1 .diagram-container')).toBeHidden();
  });

  test('code container displays Mermaid source text', async ({ page }) => {
    await page.goto('/Tooda/c4');
    await page.getByRole('button', { name: 'Code', exact: true }).click();
    await expect(page.locator('#level1 .code-container code')).toContainText('C4Context');
  });

  test('clicking Diagram button restores diagram and hides code', async ({ page }) => {
    await page.goto('/Tooda/c4');
    await page.getByRole('button', { name: 'Code', exact: true }).click();
    await page.getByRole('button', { name: 'Diagram', exact: true }).click();
    await expect(page.locator('#level1 .diagram-container')).toBeVisible();
    await expect(page.locator('#level1 .code-container')).toBeHidden();
  });

  test('code container updates when switching examples', async ({ page }) => {
    await page.goto('/Tooda/c4');
    await page.getByRole('button', { name: 'Code', exact: true }).click();
    await page.getByRole('button', { name: 'E-Commerce' }).click();
    await expect(page.locator('#level1 .code-container code')).toContainText('E-Commerce Platform');
  });

  test('code view persists when switching tabs', async ({ page }) => {
    await page.goto('/Tooda/c4');
    await page.getByRole('button', { name: 'Code', exact: true }).click();
    await page.getByRole('button', { name: 'Level 2 – Container' }).click();
    await expect(page.locator('#level2 .code-container')).toBeVisible();
    await expect(page.locator('#level2 .diagram-container')).toBeHidden();
  });
});

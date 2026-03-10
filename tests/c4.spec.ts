import { test, expect } from '@playwright/test';

test.describe('C4 diagram page', () => {
  test('has correct title', async ({ page }) => {
    await page.goto('/Tooda/c4');
    await expect(page).toHaveTitle('C4 Diagrams | Tooda');
  });

  test('displays all four tab links', async ({ page }) => {
    await page.goto('/Tooda/c4');
    await expect(page.getByRole('link', { name: 'Level 1 \u2013 Context' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Level 2 \u2013 Container' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Level 3 \u2013 Component' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Level 4 \u2013 Code' })).toBeVisible();
  });

  test('Level 1 panel is active by default', async ({ page }) => {
    await page.goto('/Tooda/c4');
    await expect(page.getByRole('link', { name: 'Level 1 \u2013 Context' })).toHaveClass(/active/);
    await expect(page.locator('#level1')).toHaveClass(/active/);
  });

  test('clicking Level 2 tab activates its panel', async ({ page }) => {
    await page.goto('/Tooda/c4');
    await page.getByRole('link', { name: 'Level 2 \u2013 Container' }).click();
    await expect(page.locator('#level2')).toHaveClass(/active/);
    await expect(page.locator('#level1')).not.toHaveClass(/active/);
  });

  test('clicking Level 3 tab activates its panel', async ({ page }) => {
    await page.goto('/Tooda/c4');
    await page.getByRole('link', { name: 'Level 3 \u2013 Component' }).click();
    await expect(page.locator('#level3')).toHaveClass(/active/);
  });

  test('clicking Level 4 tab activates its panel', async ({ page }) => {
    await page.goto('/Tooda/c4');
    await page.getByRole('link', { name: 'Level 4 \u2013 Code' }).click();
    await expect(page.locator('#level4')).toHaveClass(/active/);
  });

  test('Level 4 diagram renders without errors', async ({ page }) => {
    await page.goto('/Tooda/c4');
    await page.getByRole('link', { name: 'Level 4 \u2013 Code' }).click();
    await page.waitForSelector('#level4 .mermaid svg', { state: 'visible' });
    await expect(page.locator('#level4 .mermaid')).not.toContainText('Syntax error');
  });

  test('has a back link to the home page', async ({ page }) => {
    await page.goto('/Tooda/c4');
    const back = page.getByRole('link', { name: /Back to Home/ });
    await expect(back).toBeVisible();
    await expect(back).toHaveAttribute('href', '/Tooda/');
  });

  test('displays all four example selector links', async ({ page }) => {
    await page.goto('/Tooda/c4');
    await expect(page.getByRole('link', { name: 'Online Banking' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'E-Commerce' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Ride-Sharing' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Tooda' })).toBeVisible();
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

  test('switching to E-Commerce example updates the Level 1 diagram', async ({ page }) => {
    await page.goto('/Tooda/c4');
    await page.getByRole('link', { name: 'E-Commerce' }).click();
    await page.waitForSelector('#level1 .mermaid svg', { state: 'visible' });
    await expect(page.locator('#level1 .mermaid')).not.toContainText('Syntax error');
  });

  test('switching to Ride-Sharing example updates the Level 1 diagram', async ({ page }) => {
    await page.goto('/Tooda/c4');
    await page.getByRole('link', { name: 'Ride-Sharing' }).click();
    await page.waitForSelector('#level1 .mermaid svg', { state: 'visible' });
    await expect(page.locator('#level1 .mermaid')).not.toContainText('Syntax error');
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

  test('displays zoom control buttons', async ({ page }) => {
    await page.goto('/Tooda/c4');
    await expect(page.getByRole('button', { name: 'Zoom in' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Zoom out' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Reset zoom' })).toBeVisible();
  });

  test('zoom controls are visible in mermaid renderer', async ({ page }) => {
    await page.goto('/Tooda/c4');
    await expect(page.locator('#zoom-controls')).toBeVisible();
  });

  test('zoom controls are hidden in excalidraw renderer', async ({ page }) => {
    await page.goto('/Tooda/c4');
    await page.locator('.renderer-btn[data-renderer="excalidraw"]').click();
    await expect(page.locator('#zoom-controls')).toBeHidden();
  });

  test('zoom in button changes diagram viewBox', async ({ page }) => {
    await page.goto('/Tooda/c4');
    await page.waitForSelector('#level1 .mermaid svg', { state: 'visible' });
    const origViewBox = await page.locator('#level1 .mermaid svg').getAttribute('viewBox');
    await page.getByRole('button', { name: 'Zoom in' }).click();
    const newViewBox = await page.locator('#level1 .mermaid svg').getAttribute('viewBox');
    expect(newViewBox).not.toBe(origViewBox);
  });

  test('reset zoom button restores original viewBox', async ({ page }) => {
    await page.goto('/Tooda/c4');
    await page.waitForSelector('#level1 .mermaid svg', { state: 'visible' });
    const origViewBox = await page.locator('#level1 .mermaid svg').getAttribute('viewBox');
    await page.getByRole('button', { name: 'Zoom in' }).click();
    await page.getByRole('button', { name: 'Reset zoom' }).click();
    const restoredViewBox = await page.locator('#level1 .mermaid svg').getAttribute('viewBox');
    expect(restoredViewBox).toBe(origViewBox);
  });

  test('diagram view shows pan hint', async ({ page }) => {
    await page.goto('/Tooda/c4');
    await expect(page.locator('#pan-hint')).toBeVisible();
  });

  test('clicking Tooda example activates its link', async ({ page }) => {
    await page.goto('/Tooda/c4');
    await page.getByRole('link', { name: 'Tooda' }).click();
    await expect(page.getByRole('link', { name: 'Tooda' })).toHaveClass(/active/);
    await expect(page.getByRole('link', { name: 'Online Banking' })).not.toHaveClass(/active/);
  });

  test('switching to Tooda example updates the Level 1 diagram', async ({ page }) => {
    await page.goto('/Tooda/c4');
    await page.getByRole('link', { name: 'Tooda' }).click();
    await page.waitForSelector('#level1 .mermaid svg', { state: 'visible' });
    await expect(page.locator('#level1 .mermaid')).not.toContainText('Syntax error');
  });

  test('navigating to ?example=tooda activates Tooda example', async ({ page }) => {
    await page.goto('/Tooda/c4?example=tooda');
    await expect(page.getByRole('link', { name: 'Tooda' })).toHaveClass(/active/);
    await expect(page.getByRole('link', { name: 'Online Banking' })).not.toHaveClass(/active/);
  });

  test('Tooda example code view displays C4Context', async ({ page }) => {
    await page.goto('/Tooda/c4?example=tooda');
    await expect(page.locator('#level1 .code-container code')).toContainText('C4Context');
  });

  // \u2500\u2500 Renderer toggle tests \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500

  test('displays Excalidraw, Mermaid, 2D, and 3D renderer toggle buttons', async ({ page }) => {
    await page.goto('/Tooda/c4');
    await expect(page.getByRole('link', { name: /Excalidraw/ })).toBeVisible();
    await expect(page.getByRole('link', { name: /Mermaid/ })).toBeVisible();
    await expect(page.getByRole('link', { name: /2D/ })).toBeVisible();
    await expect(page.getByRole('link', { name: /3D/ })).toBeVisible();
  });

  test('Mermaid renderer is active by default', async ({ page }) => {
    await page.goto('/Tooda/c4');
    await expect(page.locator('.renderer-btn[data-renderer="mermaid"]')).toHaveClass(/active/);
  });

  test('Mermaid diagram renders in Level 1 by default', async ({ page }) => {
    await page.goto('/Tooda/c4');
    await page.waitForSelector('#level1 .mermaid svg', { state: 'visible', timeout: 15000 });
    await expect(page.locator('#level1 .mermaid')).not.toContainText('Syntax error');
  });

  test('clicking Excalidraw renderer shows Excalidraw view in Level 1', async ({ page }) => {
    await page.goto('/Tooda/c4');
    await page.locator('.renderer-btn[data-renderer="excalidraw"]').click();
    await expect(page.locator('.renderer-btn[data-renderer="excalidraw"]')).toHaveClass(/active/);
    await expect(page.locator('#level1 .excalidraw-view')).toBeVisible();
    await expect(page.locator('#level1 .mermaid-view')).toBeHidden();
  });

  test('clicking 2D renderer shows 2D view', async ({ page }) => {
    await page.goto('/Tooda/c4');
    await page.locator('.renderer-btn[data-renderer="2d"]').click();
    await expect(page.locator('.renderer-btn[data-renderer="2d"]')).toHaveClass(/active/);
    await expect(page.locator('#level1 .twoD-view')).toBeVisible();
  });

  test('clicking 3D renderer shows 3D view', async ({ page }) => {
    await page.goto('/Tooda/c4');
    await page.locator('.renderer-btn[data-renderer="3d"]').click();
    await expect(page.locator('.renderer-btn[data-renderer="3d"]')).toHaveClass(/active/);
    await expect(page.locator('#level1 .threeD-view')).toBeVisible();
  });
});

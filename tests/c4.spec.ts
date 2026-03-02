import { test, expect } from '@playwright/test';

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

  test('Level 4 diagram renders without errors', async ({ page }) => {
    await page.goto('/Tooda/c4');
    await page.getByRole('link', { name: 'Level 4 – Code' }).click();
    await page.waitForSelector('#level4 .mermaid svg', { state: 'visible' });
    await expect(page.locator('#level4 .mermaid')).not.toContainText('Syntax error');
  });

  test('has a back link to the home page', async ({ page }) => {
    await page.goto('/Tooda/c4');
    const back = page.getByRole('link', { name: /Back to Home/ });
    await expect(back).toBeVisible();
    await expect(back).toHaveAttribute('href', '/Tooda/');
  });

  test('displays all three example selector links', async ({ page }) => {
    await page.goto('/Tooda/c4');
    await expect(page.getByRole('link', { name: 'Online Banking' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'E-Commerce' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Ride-Sharing' })).toBeVisible();
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

  test('displays Diagram and Code view toggle links', async ({ page }) => {
    await page.goto('/Tooda/c4');
    await expect(page.getByRole('link', { name: 'Diagram', exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Code', exact: true })).toBeVisible();
  });

  test('Diagram view is active by default', async ({ page }) => {
    await page.goto('/Tooda/c4');
    await expect(page.getByRole('link', { name: 'Diagram', exact: true })).toHaveClass(/active/);
    await expect(page.getByRole('link', { name: 'Code', exact: true })).not.toHaveClass(/active/);
  });

  test('diagram is visible and code is hidden by default', async ({ page }) => {
    await page.goto('/Tooda/c4');
    await expect(page.locator('#level1 .diagram-container')).toBeVisible();
    await expect(page.locator('#level1 .code-container')).toBeHidden();
  });

  test('clicking Code link shows code and hides diagram', async ({ page }) => {
    await page.goto('/Tooda/c4');
    await page.getByRole('link', { name: 'Code', exact: true }).click();
    await expect(page.getByRole('link', { name: 'Code', exact: true })).toHaveClass(/active/);
    await expect(page.locator('#level1 .code-container')).toBeVisible();
    await expect(page.locator('#level1 .diagram-container')).toBeHidden();
  });

  test('code container displays Mermaid source text', async ({ page }) => {
    await page.goto('/Tooda/c4');
    await page.getByRole('link', { name: 'Code', exact: true }).click();
    await expect(page.locator('#level1 .code-container code')).toContainText('C4Context');
  });

  test('clicking Diagram link restores diagram and hides code', async ({ page }) => {
    await page.goto('/Tooda/c4');
    await page.getByRole('link', { name: 'Code', exact: true }).click();
    await page.getByRole('link', { name: 'Diagram', exact: true }).click();
    await expect(page.locator('#level1 .diagram-container')).toBeVisible();
    await expect(page.locator('#level1 .code-container')).toBeHidden();
  });

  test('code container updates when switching examples', async ({ page }) => {
    await page.goto('/Tooda/c4');
    await page.getByRole('link', { name: 'Code', exact: true }).click();
    await page.getByRole('link', { name: 'E-Commerce' }).click();
    await expect(page.locator('#level1 .code-container code')).toContainText('E-Commerce Platform');
  });

  test('code view persists when switching tabs', async ({ page }) => {
    await page.goto('/Tooda/c4');
    await page.getByRole('link', { name: 'Code', exact: true }).click();
    await page.getByRole('link', { name: 'Level 2 – Container' }).click();
    await expect(page.locator('#level2 .code-container')).toBeVisible();
    await expect(page.locator('#level2 .diagram-container')).toBeHidden();
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

  test('clicking Code link updates URL query parameter', async ({ page }) => {
    await page.goto('/Tooda/c4');
    await page.getByRole('link', { name: 'Code', exact: true }).click();
    await expect(page).toHaveURL(/view=code/);
  });

  test('navigating to ?view=code activates Code view', async ({ page }) => {
    await page.goto('/Tooda/c4?view=code');
    await expect(page.getByRole('link', { name: 'Code', exact: true })).toHaveClass(/active/);
    await expect(page.locator('#level1 .code-container')).toBeVisible();
  });

  test('displays Edit view toggle link', async ({ page }) => {
    await page.goto('/Tooda/c4');
    await expect(page.getByRole('link', { name: 'Edit', exact: true })).toBeVisible();
  });

  test('clicking Edit link activates Edit view and shows diagram', async ({ page }) => {
    await page.goto('/Tooda/c4');
    await page.getByRole('link', { name: 'Edit', exact: true }).click();
    await expect(page.getByRole('link', { name: 'Edit', exact: true })).toHaveClass(/active/);
    await expect(page.locator('#level1 .diagram-container')).toBeVisible();
    await expect(page.locator('#level1 .code-container')).toBeHidden();
  });

  test('clicking Edit link updates URL query parameter', async ({ page }) => {
    await page.goto('/Tooda/c4');
    await page.getByRole('link', { name: 'Edit', exact: true }).click();
    await expect(page).toHaveURL(/view=edit/);
  });

  test('navigating to ?view=edit activates Edit view', async ({ page }) => {
    await page.goto('/Tooda/c4?view=edit');
    await expect(page.getByRole('link', { name: 'Edit', exact: true })).toHaveClass(/active/);
    await expect(page.locator('#level1 .diagram-container')).toBeVisible();
  });

  test('displays zoom control buttons', async ({ page }) => {
    await page.goto('/Tooda/c4');
    await expect(page.getByRole('button', { name: 'Zoom in' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Zoom out' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Reset zoom' })).toBeVisible();
  });

  test('zoom controls are hidden in code view', async ({ page }) => {
    await page.goto('/Tooda/c4');
    await page.getByRole('link', { name: 'Code', exact: true }).click();
    await expect(page.locator('#zoom-controls')).toBeHidden();
  });

  test('zoom controls are visible in diagram view', async ({ page }) => {
    await page.goto('/Tooda/c4');
    await expect(page.locator('#zoom-controls')).toBeVisible();
  });

  test('zoom controls are visible in edit view', async ({ page }) => {
    await page.goto('/Tooda/c4');
    await page.getByRole('link', { name: 'Edit', exact: true }).click();
    await expect(page.locator('#zoom-controls')).toBeVisible();
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

  test('edit mode shows drag hint and hides pan hint', async ({ page }) => {
    await page.goto('/Tooda/c4');
    await page.getByRole('link', { name: 'Edit', exact: true }).click();
    await expect(page.locator('#edit-hint')).toBeVisible();
    await expect(page.locator('#pan-hint')).toBeHidden();
  });

  test('diagram view shows pan hint and hides drag hint', async ({ page }) => {
    await page.goto('/Tooda/c4');
    await expect(page.locator('#pan-hint')).toBeVisible();
    await expect(page.locator('#edit-hint')).toBeHidden();
  });

  test('positions container is hidden by default (diagram view)', async ({ page }) => {
    await page.goto('/Tooda/c4');
    await expect(page.locator('#level1 .positions-container')).toBeHidden();
  });

  test('positions container is hidden in code view', async ({ page }) => {
    await page.goto('/Tooda/c4');
    await page.getByRole('link', { name: 'Code', exact: true }).click();
    await expect(page.locator('#level1 .positions-container')).toBeHidden();
  });

  test('positions container is visible in edit view', async ({ page }) => {
    await page.goto('/Tooda/c4');
    await page.getByRole('link', { name: 'Edit', exact: true }).click();
    await expect(page.locator('#level1 .positions-container')).toBeVisible();
  });

  test('positions container displays node position JSON in edit view', async ({ page }) => {
    await page.goto('/Tooda/c4');
    await page.getByRole('link', { name: 'Edit', exact: true }).click();
    await page.waitForSelector('#level1 .mermaid svg', { state: 'visible' });
    await expect(page.locator('#level1 .positions-container code')).toContainText('"x"');
    await expect(page.locator('#level1 .positions-container code')).toContainText('"y"');
    // Node names should appear, not type stereotype labels
    await expect(page.locator('#level1 .positions-container code')).not.toContainText('<<person>>');
  });

  test('positions container is visible for level 4 class diagram in edit view', async ({ page }) => {
    await page.goto('/Tooda/c4');
    await page.getByRole('link', { name: 'Level 4 – Code' }).click();
    await page.getByRole('link', { name: 'Edit', exact: true }).click();
    await page.waitForSelector('#level4 .mermaid svg', { state: 'visible' });
    await expect(page.locator('#level4 .positions-container')).toBeVisible();
  });

  test('positions container hides when switching from edit to diagram view', async ({ page }) => {
    await page.goto('/Tooda/c4');
    await page.getByRole('link', { name: 'Edit', exact: true }).click();
    await expect(page.locator('#level1 .positions-container')).toBeVisible();
    await page.getByRole('link', { name: 'Diagram', exact: true }).click();
    await expect(page.locator('#level1 .positions-container')).toBeHidden();
  });

  test('positions container is visible when switching between levels in edit view', async ({ page }) => {
    await page.goto('/Tooda/c4');
    await page.getByRole('link', { name: 'Edit', exact: true }).click();
    await page.getByRole('link', { name: 'Level 2 – Container' }).click();
    await expect(page.locator('#level2 .positions-container')).toBeVisible();
  });

});

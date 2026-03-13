import { test, expect } from '@playwright/test';

test.describe('Excalidraw example page', () => {
  test('has correct title', async ({ page }) => {
    await page.goto('/Tooda/excalidraw');
    await expect(page).toHaveTitle('Excalidraw Example | Tooda');
  });

  test('displays the main heading', async ({ page }) => {
    await page.goto('/Tooda/excalidraw');
    await expect(page.getByRole('heading', { name: 'Healthcare Platform' })).toBeVisible();
  });

  test('displays all four tab links', async ({ page }) => {
    await page.goto('/Tooda/excalidraw');
    await expect(page.getByRole('link', { name: 'Level 1 – Context' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Level 2 – Container' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Level 3 – Component' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Level 4 – Code' })).toBeVisible();
  });

  test('Level 1 panel is active by default', async ({ page }) => {
    await page.goto('/Tooda/excalidraw');
    await expect(page.getByRole('link', { name: 'Level 1 – Context' })).toHaveClass(/active/);
    await expect(page.locator('#level1')).toHaveClass(/active/);
  });

  test('clicking Level 2 tab activates its panel', async ({ page }) => {
    await page.goto('/Tooda/excalidraw');
    await page.getByRole('link', { name: 'Level 2 – Container' }).click();
    await expect(page.locator('#level2')).toHaveClass(/active/);
    await expect(page.locator('#level1')).not.toHaveClass(/active/);
  });

  test('clicking Level 3 tab activates its panel', async ({ page }) => {
    await page.goto('/Tooda/excalidraw');
    await page.getByRole('link', { name: 'Level 3 – Component' }).click();
    await expect(page.locator('#level3')).toHaveClass(/active/);
  });

  test('clicking Level 4 tab activates its panel', async ({ page }) => {
    await page.goto('/Tooda/excalidraw');
    await page.getByRole('link', { name: 'Level 4 – Code' }).click();
    await expect(page.locator('#level4')).toHaveClass(/active/);
  });

  test('has a back link to the home page', async ({ page }) => {
    await page.goto('/Tooda/excalidraw');
    const back = page.getByRole('link', { name: /Back to Home/ });
    await expect(back).toBeVisible();
    await expect(back).toHaveAttribute('href', '/Tooda/');
  });

  test('Excalidraw canvas renders in Level 1 panel', async ({ page }) => {
    await page.goto('/Tooda/excalidraw');
    await page.waitForSelector('#level1 .excalidraw', { state: 'visible', timeout: 15000 });
    await expect(page.locator('#level1 .excalidraw')).toBeVisible();
  });

  test('Excalidraw canvas renders in Level 2 panel after switching tab', async ({ page }) => {
    await page.goto('/Tooda/excalidraw');
    await page.getByRole('link', { name: 'Level 2 – Container' }).click();
    await page.waitForSelector('#level2 .excalidraw', { state: 'visible', timeout: 15000 });
    await expect(page.locator('#level2 .excalidraw')).toBeVisible();
  });

  test('Edit button is visible in Level 1 panel', async ({ page }) => {
    await page.goto('/Tooda/excalidraw');
    await page.waitForSelector('#level1 .excalidraw', { state: 'visible', timeout: 15000 });
    await expect(page.locator('#level1').getByRole('button', { name: 'Edit' })).toBeVisible();
  });

  test('Export JSON button is visible in Level 1 panel', async ({ page }) => {
    await page.goto('/Tooda/excalidraw');
    await page.waitForSelector('#level1 .excalidraw', { state: 'visible', timeout: 15000 });
    await expect(page.locator('#level1').getByRole('button', { name: 'Export JSON' })).toBeVisible();
  });

  test('clicking Edit button toggles to View button', async ({ page }) => {
    await page.goto('/Tooda/excalidraw');
    await page.waitForSelector('#level1 .excalidraw', { state: 'visible', timeout: 15000 });
    const editBtn = page.locator('#level1').getByRole('button', { name: 'Edit' });
    await editBtn.click();
    await expect(page.locator('#level1').getByRole('button', { name: 'View' })).toBeVisible();
    await expect(page.locator('#level1').getByRole('button', { name: 'Edit' })).not.toBeVisible();
  });

  test('clicking View button (after Edit) toggles back to Edit button', async ({ page }) => {
    await page.goto('/Tooda/excalidraw');
    await page.waitForSelector('#level1 .excalidraw', { state: 'visible', timeout: 15000 });
    await page.locator('#level1').getByRole('button', { name: 'Edit' }).click();
    await page.locator('#level1').getByRole('button', { name: 'View' }).click();
    await expect(page.locator('#level1').getByRole('button', { name: 'Edit' })).toBeVisible();
  });

  test('Export JSON button triggers file download', async ({ page }) => {
    await page.goto('/Tooda/excalidraw');
    await page.waitForSelector('#level1 .excalidraw', { state: 'visible', timeout: 15000 });
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.locator('#level1').getByTestId('export-json-btn').click(),
    ]);
    expect(download.suggestedFilename()).toMatch(/^diagram-.*\.json$/);
  });

  // ── Renderer toggle tests ─────────────────────────────────────────────────

  test('displays Excalidraw, Mermaid, 2D, and 3D renderer toggle buttons', async ({ page }) => {
    await page.goto('/Tooda/excalidraw');
    await expect(page.getByRole('link', { name: /Excalidraw/ })).toBeVisible();
    await expect(page.getByRole('link', { name: /Mermaid/ })).toBeVisible();
    await expect(page.getByRole('link', { name: /2D/ })).toBeVisible();
    await expect(page.getByRole('link', { name: /3D/ })).toBeVisible();
  });

  test('Excalidraw renderer is active by default', async ({ page }) => {
    await page.goto('/Tooda/excalidraw');
    await expect(page.locator('.renderer-btn[data-renderer="excalidraw"]')).toHaveClass(/active/);
    await expect(page.locator('.renderer-btn[data-renderer="mermaid"]')).not.toHaveClass(/active/);
    await expect(page.locator('.renderer-btn[data-renderer="2d"]')).not.toHaveClass(/active/);
    await expect(page.locator('.renderer-btn[data-renderer="3d"]')).not.toHaveClass(/active/);
  });

  test('Excalidraw view is visible and Mermaid view is hidden by default', async ({ page }) => {
    await page.goto('/Tooda/excalidraw');
    await expect(page.locator('#level1 .excalidraw-view')).toBeVisible();
    await expect(page.locator('#level1 .mermaid-view')).toBeHidden();
    await expect(page.locator('#level1 .twoD-view')).toBeHidden();
    await expect(page.locator('#level1 .threeD-view')).toBeHidden();
  });

  test('clicking Mermaid renderer button activates Mermaid view', async ({ page }) => {
    await page.goto('/Tooda/excalidraw');
    await page.locator('.renderer-btn[data-renderer="mermaid"]').click();
    await expect(page.locator('.renderer-btn[data-renderer="mermaid"]')).toHaveClass(/active/);
    await expect(page.locator('.renderer-btn[data-renderer="excalidraw"]')).not.toHaveClass(/active/);
  });

  test('Mermaid diagram renders in Level 1 after switching to Mermaid renderer', async ({ page }) => {
    await page.goto('/Tooda/excalidraw');
    await page.locator('.renderer-btn[data-renderer="mermaid"]').click();
    await page.waitForSelector('#level1 .mermaid-view svg', { state: 'visible', timeout: 15000 });
    await expect(page.locator('#level1 .mermaid-view svg')).toBeVisible();
  });

  test('Excalidraw view is hidden and Mermaid view is visible after switching to Mermaid', async ({ page }) => {
    await page.goto('/Tooda/excalidraw');
    await page.locator('.renderer-btn[data-renderer="mermaid"]').click();
    await expect(page.locator('#level1 .excalidraw-view')).toBeHidden();
    await expect(page.locator('#level1 .mermaid-view')).toBeVisible();
  });

  test('switching back to Excalidraw renderer restores Excalidraw view', async ({ page }) => {
    await page.goto('/Tooda/excalidraw');
    await page.locator('.renderer-btn[data-renderer="mermaid"]').click();
    await page.locator('.renderer-btn[data-renderer="excalidraw"]').click();
    await expect(page.locator('#level1 .excalidraw-view')).toBeVisible();
    await expect(page.locator('#level1 .mermaid-view')).toBeHidden();
    await expect(page.locator('#level1 .threeD-view')).toBeHidden();
  });

  test('clicking 3D renderer button activates 3D button and hides Excalidraw view', async ({ page }) => {
    await page.goto('/Tooda/excalidraw');
    await page.locator('.renderer-btn[data-renderer="3d"]').click();
    await expect(page.locator('.renderer-btn[data-renderer="3d"]')).toHaveClass(/active/);
    await expect(page.locator('.renderer-btn[data-renderer="excalidraw"]')).not.toHaveClass(/active/);
    await expect(page.locator('#level1 .excalidraw-view')).toBeHidden();
    await expect(page.locator('#level1 .mermaid-view')).toBeHidden();
  });

  test('3D view is visible and Excalidraw view is hidden after switching to 3D renderer', async ({ page }) => {
    await page.goto('/Tooda/excalidraw');
    await page.locator('.renderer-btn[data-renderer="3d"]').click();
    await expect(page.locator('#level1 .threeD-view')).toBeVisible();
    await expect(page.locator('#level1 .excalidraw-view')).toBeHidden();
  });

  test('3D canvas renders in Level 1 after switching to 3D renderer', async ({ page }) => {
    await page.goto('/Tooda/excalidraw');
    await page.locator('.renderer-btn[data-renderer="3d"]').click();
    await page.waitForSelector('#level1 [data-testid="three-canvas-container"] canvas', { state: 'visible', timeout: 15000 });
    await expect(page.locator('#level1 [data-testid="three-canvas-container"] canvas')).toBeVisible();
  });

  test('3D renderer is activated when ?renderer=3d is in the URL', async ({ page }) => {
    await page.goto('/Tooda/excalidraw?renderer=3d');
    await expect(page.locator('.renderer-btn[data-renderer="3d"]')).toHaveClass(/active/);
    await expect(page.locator('#level1 .threeD-view')).toBeVisible();
    await expect(page.locator('#level1 .excalidraw-view')).toBeHidden();
  });

  test('switching from 3D back to Excalidraw renderer restores Excalidraw view', async ({ page }) => {
    await page.goto('/Tooda/excalidraw');
    await page.locator('.renderer-btn[data-renderer="3d"]').click();
    await page.locator('.renderer-btn[data-renderer="excalidraw"]').click();
    await expect(page.locator('#level1 .excalidraw-view')).toBeVisible();
    await expect(page.locator('#level1 .threeD-view')).toBeHidden();
  });

  test('clicking 2D renderer button activates 2D view and hides Excalidraw view', async ({ page }) => {
    await page.goto('/Tooda/excalidraw');
    await page.locator('.renderer-btn[data-renderer="2d"]').click();
    await expect(page.locator('.renderer-btn[data-renderer="2d"]')).toHaveClass(/active/);
    await expect(page.locator('.renderer-btn[data-renderer="excalidraw"]')).not.toHaveClass(/active/);
    await expect(page.locator('#level1 .excalidraw-view')).toBeHidden();
    await expect(page.locator('#level1 .mermaid-view')).toBeHidden();
    await expect(page.locator('#level1 .threeD-view')).toBeHidden();
  });

  test('2D view is visible and Excalidraw view is hidden after switching to 2D renderer', async ({ page }) => {
    await page.goto('/Tooda/excalidraw');
    await page.locator('.renderer-btn[data-renderer="2d"]').click();
    await expect(page.locator('#level1 .twoD-view')).toBeVisible();
    await expect(page.locator('#level1 .excalidraw-view')).toBeHidden();
  });

  test('2D diagram SVG renders in Level 1 after switching to 2D renderer', async ({ page }) => {
    await page.goto('/Tooda/excalidraw');
    await page.locator('.renderer-btn[data-renderer="2d"]').click();
    await page.waitForSelector('#level1 [data-testid="two-d-diagram"]', { state: 'visible', timeout: 15000 });
    await expect(page.locator('#level1 [data-testid="two-d-diagram"]')).toBeVisible();
  });

  test('2D renderer is activated when ?renderer=2d is in the URL', async ({ page }) => {
    await page.goto('/Tooda/excalidraw?renderer=2d');
    await expect(page.locator('.renderer-btn[data-renderer="2d"]')).toHaveClass(/active/);
    await expect(page.locator('#level1 .twoD-view')).toBeVisible();
    await expect(page.locator('#level1 .excalidraw-view')).toBeHidden();
  });

  test('switching from 2D back to Excalidraw renderer restores Excalidraw view', async ({ page }) => {
    await page.goto('/Tooda/excalidraw');
    await page.locator('.renderer-btn[data-renderer="2d"]').click();
    await page.locator('.renderer-btn[data-renderer="excalidraw"]').click();
    await expect(page.locator('#level1 .excalidraw-view')).toBeVisible();
    await expect(page.locator('#level1 .twoD-view')).toBeHidden();
  });

  // ── 2D diagram uses Excalidraw as source of truth for connections ────────────

  test('2D diagram in Level 1 contains node labels from Excalidraw', async ({ page }) => {
    await page.goto('/Tooda/excalidraw?renderer=2d');
    await page.waitForSelector('#level1 [data-testid="two-d-diagram"]', { state: 'visible', timeout: 15000 });
    const svgText = await page.locator('#level1 [data-testid="two-d-diagram"]').textContent();
    expect(svgText).toContain('Patient');
    expect(svgText).toContain('Doctor');
  });

  test('Mermaid renderer is activated when ?renderer=mermaid is in the URL', async ({ page }) => {
    await page.goto('/Tooda/excalidraw?renderer=mermaid');
    await expect(page.locator('.renderer-btn[data-renderer="mermaid"]')).toHaveClass(/active/);
    await expect(page.locator('#level1 .mermaid-view')).toBeVisible();
    await expect(page.locator('#level1 .excalidraw-view')).toBeHidden();
  });

  test('Mermaid diagram renders in Level 2 after switching tab while in Mermaid mode', async ({ page }) => {
    await page.goto('/Tooda/excalidraw?renderer=mermaid');
    await page.getByRole('link', { name: 'Level 2 – Container' }).click();
    await page.waitForSelector('#level2 .mermaid-view svg', { state: 'visible', timeout: 15000 });
    await expect(page.locator('#level2 .mermaid-view svg')).toBeVisible();
  });

  // ── Mermaid derived from Excalidraw (source-of-truth) tests ─────────────────

  test('Mermaid Level 3 diagram renders after switching tab while in Mermaid mode', async ({ page }) => {
    await page.goto('/Tooda/excalidraw?renderer=mermaid');
    await page.getByRole('link', { name: 'Level 3 – Component' }).click();
    await page.waitForSelector('#level3 .mermaid-view svg', { state: 'visible', timeout: 15000 });
    await expect(page.locator('#level3 .mermaid-view svg')).toBeVisible();
  });

  test('Mermaid Level 4 diagram renders after switching tab while in Mermaid mode', async ({ page }) => {
    await page.goto('/Tooda/excalidraw?renderer=mermaid');
    await page.getByRole('link', { name: 'Level 4 – Code' }).click();
    await page.waitForSelector('#level4 .mermaid-view svg', { state: 'visible', timeout: 15000 });
    await expect(page.locator('#level4 .mermaid-view svg')).toBeVisible();
  });

  test('Mermaid Level 1 diagram contains node labels derived from Excalidraw', async ({ page }) => {
    await page.goto('/Tooda/excalidraw?renderer=mermaid');
    await page.waitForSelector('#level1 .mermaid-view svg', { state: 'visible', timeout: 15000 });
    // The Excalidraw label for l1-patient is "Patient" – it must appear in the rendered SVG
    const svgText = await page.locator('#level1 .mermaid-view svg').textContent();
    expect(svgText).toContain('Patient');
    expect(svgText).toContain('Doctor');
  });

  test('Mermaid Level 4 classDiagram contains class names derived from Excalidraw', async ({ page }) => {
    await page.goto('/Tooda/excalidraw?renderer=mermaid');
    await page.getByRole('link', { name: 'Level 4 – Code' }).click();
    await page.waitForSelector('#level4 .mermaid-view svg', { state: 'visible', timeout: 15000 });
    const svgText = await page.locator('#level4 .mermaid-view svg').textContent();
    expect(svgText).toContain('RecordController');
    expect(svgText).toContain('RecordService');
  });
});

test.describe('Export PNG button', () => {
  test('Export PNG button is visible on the page', async ({ page }) => {
    await page.goto('/Tooda/excalidraw');
    await expect(page.getByTestId('export-png-btn')).toBeVisible();
  });

  test('Export PNG button has correct default href (excalidraw level1)', async ({ page }) => {
    await page.goto('/Tooda/excalidraw');
    const btn = page.getByTestId('export-png-btn');
    await expect(btn).toHaveAttribute('href', '/Tooda/api/healthcare/excalidraw/level1.png');
  });

  test('Export PNG button href updates when switching to Level 2 tab', async ({ page }) => {
    await page.goto('/Tooda/excalidraw');
    await page.getByRole('link', { name: 'Level 2 – Container' }).click();
    const btn = page.getByTestId('export-png-btn');
    await expect(btn).toHaveAttribute('href', '/Tooda/api/healthcare/excalidraw/level2.png');
  });

  test('Export PNG button href updates when switching to Mermaid renderer', async ({ page }) => {
    await page.goto('/Tooda/excalidraw');
    await page.locator('.renderer-btn[data-renderer="mermaid"]').click();
    const btn = page.getByTestId('export-png-btn');
    await expect(btn).toHaveAttribute('href', '/Tooda/api/healthcare/mermaid/level1.png');
  });

  test('Export PNG button href updates for Mermaid renderer on Level 3 tab', async ({ page }) => {
    await page.goto('/Tooda/excalidraw');
    await page.locator('.renderer-btn[data-renderer="mermaid"]').click();
    await page.getByRole('link', { name: 'Level 3 – Component' }).click();
    const btn = page.getByTestId('export-png-btn');
    await expect(btn).toHaveAttribute('href', '/Tooda/api/healthcare/mermaid/level3.png');
  });

  test('Export PNG button is hidden when 3D renderer is active', async ({ page }) => {
    await page.goto('/Tooda/excalidraw');
    await page.locator('.renderer-btn[data-renderer="3d"]').click();
    await expect(page.locator('#export-png-container')).toBeHidden();
  });

  test('Export PNG button is visible when 2D renderer is active', async ({ page }) => {
    await page.goto('/Tooda/excalidraw');
    await page.locator('.renderer-btn[data-renderer="2d"]').click();
    await expect(page.locator('#export-png-container')).toBeVisible();
    await expect(page.getByTestId('export-png-btn')).toBeVisible();
  });

  test('Export PNG button href updates when switching to 2D renderer', async ({ page }) => {
    await page.goto('/Tooda/excalidraw');
    await page.locator('.renderer-btn[data-renderer="2d"]').click();
    const btn = page.getByTestId('export-png-btn');
    await expect(btn).toHaveAttribute('href', '/Tooda/api/healthcare/2d/level1.png');
  });

  test('Export PNG button href updates for 2D renderer on Level 2 tab', async ({ page }) => {
    await page.goto('/Tooda/excalidraw');
    await page.locator('.renderer-btn[data-renderer="2d"]').click();
    await page.getByRole('link', { name: 'Level 2 – Container' }).click();
    const btn = page.getByTestId('export-png-btn');
    await expect(btn).toHaveAttribute('href', '/Tooda/api/healthcare/2d/level2.png');
  });

  test('Export PNG button is visible again after switching from 3D back to Excalidraw', async ({ page }) => {
    await page.goto('/Tooda/excalidraw');
    await page.locator('.renderer-btn[data-renderer="3d"]').click();
    await page.locator('.renderer-btn[data-renderer="excalidraw"]').click();
    await expect(page.locator('#export-png-container')).toBeVisible();
    await expect(page.getByTestId('export-png-btn')).toBeVisible();
  });

  test('Export PNG button has correct download attribute', async ({ page }) => {
    await page.goto('/Tooda/excalidraw');
    const btn = page.getByTestId('export-png-btn');
    await expect(btn).toHaveAttribute('download', 'healthcare-excalidraw-level1.png');
  });

  test('Export PNG button download attribute updates when switching to 2D renderer', async ({ page }) => {
    await page.goto('/Tooda/excalidraw');
    await page.locator('.renderer-btn[data-renderer="2d"]').click();
    const btn = page.getByTestId('export-png-btn');
    await expect(btn).toHaveAttribute('download', 'healthcare-2d-level1.png');
  });

  test('Export PNG button download attribute updates when switching to Mermaid renderer on Level 4', async ({ page }) => {
    await page.goto('/Tooda/excalidraw');
    await page.locator('.renderer-btn[data-renderer="mermaid"]').click();
    await page.getByRole('link', { name: 'Level 4 – Code' }).click();
    const btn = page.getByTestId('export-png-btn');
    await expect(btn).toHaveAttribute('download', 'healthcare-mermaid-level4.png');
  });
});


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

  test('displays Excalidraw and Mermaid renderer toggle buttons', async ({ page }) => {
    await page.goto('/Tooda/excalidraw');
    await expect(page.getByRole('link', { name: /Excalidraw/ })).toBeVisible();
    await expect(page.getByRole('link', { name: /Mermaid/ })).toBeVisible();
  });

  test('Excalidraw renderer is active by default', async ({ page }) => {
    await page.goto('/Tooda/excalidraw');
    await expect(page.locator('.renderer-btn[data-renderer="excalidraw"]')).toHaveClass(/active/);
    await expect(page.locator('.renderer-btn[data-renderer="mermaid"]')).not.toHaveClass(/active/);
  });

  test('Excalidraw view is visible and Mermaid view is hidden by default', async ({ page }) => {
    await page.goto('/Tooda/excalidraw');
    await expect(page.locator('#level1 .excalidraw-view')).toBeVisible();
    await expect(page.locator('#level1 .mermaid-view')).toBeHidden();
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
});


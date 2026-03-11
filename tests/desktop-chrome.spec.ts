import { test, expect, devices } from '@playwright/test';

test.use({ ...devices['Desktop Chrome'] });

// ---------------------------------------------------------------------------
// API Explorer page – desktop
// ---------------------------------------------------------------------------

test.describe('Desktop – API Explorer page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/Tooda/api');
  });

  test('has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('API Explorer | Tooda');
  });

  test('displays the main heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'API Explorer' })).toBeVisible();
  });

  test('has a back link to the home page', async ({ page }) => {
    const back = page.getByRole('link', { name: /Back to Home/ });
    await expect(back).toBeVisible();
    await expect(back).toHaveAttribute('href', '/Tooda/');
  });

  test('renders the Swagger UI container', async ({ page }) => {
    await expect(page.locator('#swagger-ui')).toBeVisible();
  });

  test('loads the OpenAPI spec and displays the API title', async ({ page }) => {
    await expect(page.locator('.swagger-ui')).toBeVisible();
    await expect(page.getByText('Tooda API')).toBeVisible();
  });

  test('displays C4 endpoint paths', async ({ page }) => {
    await expect(page.getByText('/api/c4/banking.json')).toBeVisible();
    await expect(page.getByText('/api/c4/ecommerce.json')).toBeVisible();
    await expect(page.getByText('/api/c4/ridesharing.json')).toBeVisible();
  });

  test('displays Excalidraw endpoint paths', async ({ page }) => {
    await expect(page.getByText('/api/excalidraw/level1.json')).toBeVisible();
    await expect(page.getByText('/api/excalidraw/level2.json')).toBeVisible();
    await expect(page.getByText('/api/excalidraw/level3.json')).toBeVisible();
    await expect(page.getByText('/api/excalidraw/level4.json')).toBeVisible();
  });
});

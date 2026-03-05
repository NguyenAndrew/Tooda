import { test, expect } from '@playwright/test';

const BANKING_PATH = '/api/c4/banking.json';
const BANKING_ENDPOINT = `/Tooda${BANKING_PATH}`;

test.describe('API Explorer page', () => {
  test('has correct title', async ({ page }) => {
    await page.goto('/Tooda/api');
    await expect(page).toHaveTitle('API Explorer | Tooda');
  });

  test('displays the main heading', async ({ page }) => {
    await page.goto('/Tooda/api');
    await expect(page.getByRole('heading', { name: 'API Explorer' })).toBeVisible();
  });

  test('has a back link to the home page', async ({ page }) => {
    await page.goto('/Tooda/api');
    const back = page.getByRole('link', { name: /Back to Home/ });
    await expect(back).toBeVisible();
    await expect(back).toHaveAttribute('href', '/Tooda/');
  });

  test('displays the OpenAPI spec banner with a link', async ({ page }) => {
    await page.goto('/Tooda/api');
    const banner = page.getByRole('note', { name: 'OpenAPI specification' });
    await expect(banner).toBeVisible();
    const specLink = banner.getByRole('link');
    await expect(specLink).toBeVisible();
    await expect(specLink).toHaveAttribute('href', '/Tooda/api/openapi.json');
  });

  test('displays C4 diagram endpoints section', async ({ page }) => {
    await page.goto('/Tooda/api');
    await expect(page.getByRole('region', { name: 'C4 diagram endpoints' })).toBeVisible();
  });

  test('displays Excalidraw endpoints section', async ({ page }) => {
    await page.goto('/Tooda/api');
    await expect(page.getByRole('region', { name: 'Excalidraw endpoints' })).toBeVisible();
  });

  test('shows all seven endpoint paths', async ({ page }) => {
    await page.goto('/Tooda/api');
    await expect(page.getByText('/api/c4/banking.json')).toBeVisible();
    await expect(page.getByText('/api/c4/ecommerce.json')).toBeVisible();
    await expect(page.getByText('/api/c4/ridesharing.json')).toBeVisible();
    await expect(page.getByText('/api/excalidraw/level1.json')).toBeVisible();
    await expect(page.getByText('/api/excalidraw/level2.json')).toBeVisible();
    await expect(page.getByText('/api/excalidraw/level3.json')).toBeVisible();
    await expect(page.getByText('/api/excalidraw/level4.json')).toBeVisible();
  });

  test('shows seven "Try it" buttons', async ({ page }) => {
    await page.goto('/Tooda/api');
    await expect(page.locator('.try-btn')).toHaveCount(7);
  });

  test('clicking "Try it" fetches and shows the JSON response', async ({ page }) => {
    await page.goto('/Tooda/api');
    const btn = page.getByRole('button', { name: `Try ${BANKING_PATH}` });
    await btn.click();
    // The response panel should become visible
    await expect(page.locator(`[data-endpoint="${BANKING_ENDPOINT}"] .response-panel`)).toBeVisible();
    // The status badge should show 200
    await expect(page.locator(`[data-endpoint="${BANKING_ENDPOINT}"] .status-ok`)).toContainText('200');
    // The button should now say "Close"
    await expect(btn).toHaveText('Close');
  });

  test('clicking "Close" hides the response panel', async ({ page }) => {
    await page.goto('/Tooda/api');
    const btn = page.getByRole('button', { name: `Try ${BANKING_PATH}` });
    await btn.click();
    await expect(page.locator(`[data-endpoint="${BANKING_ENDPOINT}"] .response-panel`)).toBeVisible();
    await btn.click();
    await expect(page.locator(`[data-endpoint="${BANKING_ENDPOINT}"] .response-panel`)).toBeHidden();
    await expect(btn).toHaveText('Try it');
  });

  test('response panel shows a link to open raw JSON', async ({ page }) => {
    await page.goto('/Tooda/api');
    const btn = page.getByRole('button', { name: `Try ${BANKING_PATH}` });
    await btn.click();
    const openLink = page.locator(`[data-endpoint="${BANKING_ENDPOINT}"] .open-btn`);
    await expect(openLink).toBeVisible();
    await expect(openLink).toHaveAttribute('href', BANKING_ENDPOINT);
  });

  test('response body contains JSON content', async ({ page }) => {
    await page.goto('/Tooda/api');
    await page.getByRole('button', { name: `Try ${BANKING_PATH}` }).click();
    await expect(
      page.locator(`[data-endpoint="${BANKING_ENDPOINT}"] .response-body`)
    ).toContainText('Online Banking System');
  });

  test('home page has a link to the API Explorer', async ({ page }) => {
    await page.goto('/Tooda/');
    const link = page.getByRole('link', { name: /API Explorer/ });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute('href', '/Tooda/api');
  });
});

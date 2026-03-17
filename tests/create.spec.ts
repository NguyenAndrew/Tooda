import { test, expect } from '@playwright/test';

const CREATE_URL = '/Tooda/create';
const EXCALIDRAW_SELECTOR = '.excalidraw';
const EXCALIDRAW_TIMEOUT = 15000;

test.describe('Create New Diagram page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(CREATE_URL);
  });

  test('has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Create New Diagram | Tooda');
  });

  test('displays the main heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Create New Diagram' })).toBeVisible();
  });

  test('has a back link to the home page', async ({ page }) => {
    const back = page.getByRole('link', { name: /Back to Home/ });
    await expect(back).toBeVisible();
    await expect(back).toHaveAttribute('href', '/Tooda/');
  });

  test('Excalidraw canvas renders on the page', async ({ page }) => {
    await page.waitForSelector(EXCALIDRAW_SELECTOR, { state: 'visible', timeout: EXCALIDRAW_TIMEOUT });
    await expect(page.locator(EXCALIDRAW_SELECTOR)).toBeVisible();
  });

  test('canvas starts in edit mode (View button is shown)', async ({ page }) => {
    await page.waitForSelector(EXCALIDRAW_SELECTOR, { state: 'visible', timeout: EXCALIDRAW_TIMEOUT });
    await expect(page.getByRole('button', { name: 'View' })).toBeVisible();
  });

  test('Export JSON button is visible', async ({ page }) => {
    await page.waitForSelector(EXCALIDRAW_SELECTOR, { state: 'visible', timeout: EXCALIDRAW_TIMEOUT });
    await expect(page.getByTestId('export-json-btn')).toBeVisible();
  });

  test('clicking View button switches to view mode (Edit button is shown)', async ({ page }) => {
    await page.waitForSelector(EXCALIDRAW_SELECTOR, { state: 'visible', timeout: EXCALIDRAW_TIMEOUT });
    await page.getByRole('button', { name: 'View' }).click();
    await expect(page.getByRole('button', { name: 'Edit' })).toBeVisible();
  });

  test('Export JSON button triggers a file download', async ({ page }) => {
    await page.waitForSelector(EXCALIDRAW_SELECTOR, { state: 'visible', timeout: EXCALIDRAW_TIMEOUT });
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.getByTestId('export-json-btn').click(),
    ]);
    expect(download.suggestedFilename()).toMatch(/^diagram-.*\.json$/);
  });
});

test.describe('Home page – Create New Diagram link', () => {
  test('has a link to the create page', async ({ page }) => {
    await page.goto('/Tooda/');
    await expect(page.getByRole('link', { name: /Create New Diagram/ })).toHaveAttribute('href', '/Tooda/create');
  });

  test('Create New Diagram link is visible', async ({ page }) => {
    await page.goto('/Tooda/');
    await expect(page.getByRole('link', { name: /Create New Diagram/ })).toBeVisible();
  });
});

test.describe('Home page – Create New Diagram link mobile tap', () => {
  test.use({ hasTouch: true });

  test('Create New Diagram link is clickable on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/Tooda/');
    const link = page.getByRole('link', { name: /Create New Diagram/ });
    await expect(link).toBeVisible();
    await Promise.all([
      page.waitForURL(/\/Tooda\/create/),
      link.tap(),
    ]);
  });
});

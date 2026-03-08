import { test, expect, devices } from '@playwright/test';

// iPhone 13 portrait dimensions (matches the 'iPhone 13' Playwright device profile).
const IPHONE_PORTRAIT = { width: 390, height: 844 };
// iPhone 13 landscape – triggers the mobile-landscape CSS breakpoint (max-height: 500px).
const IPHONE_LANDSCAPE = { width: 844, height: 390 };

test.use({ ...devices['iPhone 13'], browserName: 'chromium' });

// ---------------------------------------------------------------------------
// Home page – portrait
// ---------------------------------------------------------------------------

test.describe('iPhone – Home page (portrait)', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(IPHONE_PORTRAIT);
    await page.goto('/Tooda/');
  });

  test('has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Tooda');
  });

  test('displays the main heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Tooda' })).toBeVisible();
  });

  test('all navigation links are visible', async ({ page }) => {
    await expect(page.getByRole('link', { name: /Online Banking/ })).toBeVisible();
    await expect(page.getByRole('link', { name: /E-Commerce/ })).toBeVisible();
    await expect(page.getByRole('link', { name: /Ride-Sharing/ })).toBeVisible();
    await expect(page.getByRole('link', { name: /Healthcare/ })).toBeVisible();
    await expect(page.getByRole('link', { name: /View All Features/ })).toBeVisible();
    await expect(page.getByRole('link', { name: /View Slide Deck/ })).toBeVisible();
    await expect(page.getByRole('link', { name: /API Explorer/ })).toBeVisible();
  });

  test('Online Banking link taps to C4 page', async ({ page }) => {
    await Promise.all([
      page.waitForURL(/\/Tooda\/c4/),
      page.getByRole('link', { name: /Online Banking/ }).tap(),
    ]);
  });

  test('E-Commerce link taps to C4 page', async ({ page }) => {
    await Promise.all([
      page.waitForURL(/\/Tooda\/c4/),
      page.getByRole('link', { name: /E-Commerce/ }).tap(),
    ]);
  });

  test('Ride-Sharing link taps to C4 page', async ({ page }) => {
    await Promise.all([
      page.waitForURL(/\/Tooda\/c4/),
      page.getByRole('link', { name: /Ride-Sharing/ }).tap(),
    ]);
  });

  test('Healthcare link taps to Excalidraw page', async ({ page }) => {
    await Promise.all([
      page.waitForURL(/\/Tooda\/excalidraw/),
      page.getByRole('link', { name: /Healthcare/ }).tap(),
    ]);
  });

  test('View All Features link taps to features page', async ({ page }) => {
    await Promise.all([
      page.waitForURL(/\/Tooda\/features/),
      page.getByRole('link', { name: /View All Features/ }).tap(),
    ]);
  });

  test('View Slide Deck link taps to slideshow page', async ({ page }) => {
    await Promise.all([
      page.waitForURL(/\/Tooda\/slideshow/),
      page.getByRole('link', { name: /View Slide Deck/ }).tap(),
    ]);
  });

  test('API Explorer link taps to API page', async ({ page }) => {
    await Promise.all([
      page.waitForURL(/\/Tooda\/api/),
      page.getByRole('link', { name: /API Explorer/ }).tap(),
    ]);
  });
});

// ---------------------------------------------------------------------------
// Home page – landscape
// ---------------------------------------------------------------------------

test.describe('iPhone – Home page (landscape)', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(IPHONE_LANDSCAPE);
    await page.goto('/Tooda/');
  });

  test('displays the main heading in landscape', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Tooda' })).toBeVisible();
  });

  test('all navigation links are visible in landscape', async ({ page }) => {
    await expect(page.getByRole('link', { name: /Online Banking/ })).toBeVisible();
    await expect(page.getByRole('link', { name: /E-Commerce/ })).toBeVisible();
    await expect(page.getByRole('link', { name: /Ride-Sharing/ })).toBeVisible();
  });
});

// ---------------------------------------------------------------------------
// Slideshow – portrait
// ---------------------------------------------------------------------------

test.describe('iPhone – Slideshow page (portrait)', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(IPHONE_PORTRAIT);
    await page.goto('/Tooda/slideshow');
  });

  test('has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Slide Deck | Tooda');
  });

  test('displays the first slide on load', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Welcome to Tooda' })).toBeVisible();
  });

  test('shows slide counter starting at 1 / 6', async ({ page }) => {
    await expect(page.locator('#slide-counter')).toHaveText('1 / 6');
  });

  test('Prev button is disabled on the first slide', async ({ page }) => {
    await expect(page.locator('#btn-prev')).toBeDisabled();
  });

  test('Next button is enabled on the first slide', async ({ page }) => {
    await expect(page.locator('#btn-next')).toBeEnabled();
  });

  test('tapping Next navigates to the second slide', async ({ page }) => {
    await page.locator('#btn-next').tap();
    await expect(page.getByRole('heading', { name: 'C4 Architecture Diagrams' })).toBeVisible();
    await expect(page.locator('#slide-counter')).toHaveText('2 / 6');
  });

  test('tapping Prev navigates back to the first slide', async ({ page }) => {
    await page.locator('#btn-next').tap();
    await page.locator('#btn-prev').tap();
    await expect(page.getByRole('heading', { name: 'Welcome to Tooda' })).toBeVisible();
    await expect(page.locator('#slide-counter')).toHaveText('1 / 6');
  });

  test('Next button is disabled on the last slide', async ({ page }) => {
    for (let i = 0; i < 5; i++) {
      await page.locator('#btn-next').tap();
    }
    await expect(page.locator('#btn-next')).toBeDisabled();
    await expect(page.locator('#slide-counter')).toHaveText('6 / 6');
  });

  test('all 6 slides are reachable via Next tap', async ({ page }) => {
    const expectedHeadings = [
      'Welcome to Tooda',
      'C4 Architecture Diagrams',
      'Freehand Diagrams',
      'API Explorer',
      'Platform & Technology',
      'Start Exploring',
    ];
    for (const heading of expectedHeadings) {
      await expect(page.getByRole('heading', { name: heading })).toBeVisible();
      const isLast = heading === expectedHeadings[expectedHeadings.length - 1];
      if (!isLast) {
        await page.locator('#btn-next').tap();
      }
    }
  });

  test('progress dot tap navigates to the correct slide', async ({ page }) => {
    const dots = page.locator('#progress-dots button');
    await dots.nth(2).tap();
    await expect(page.getByRole('heading', { name: 'Freehand Diagrams' })).toBeVisible();
    await expect(page.locator('#slide-counter')).toHaveText('3 / 6');
  });

});

// URL hash restoration needs a fresh page load (no beforeEach pre-navigation).
test('iPhone – Slideshow portrait – restores slide from URL hash on load', async ({ page }) => {
  await page.setViewportSize(IPHONE_PORTRAIT);
  await page.goto('/Tooda/slideshow#slide-4');
  await expect(page.getByRole('heading', { name: 'API Explorer' })).toBeVisible();
  await expect(page.locator('#slide-counter')).toHaveText('4 / 6');
});

// ---------------------------------------------------------------------------
// Slideshow – landscape (triggers mobile-landscape CSS: max-height ≤ 500px)
// ---------------------------------------------------------------------------

test.describe('iPhone – Slideshow page (landscape)', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(IPHONE_LANDSCAPE);
    await page.goto('/Tooda/slideshow');
  });

  test('displays the first slide in landscape', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Welcome to Tooda' })).toBeVisible();
  });

  test('slide counter is visible in landscape', async ({ page }) => {
    await expect(page.locator('#slide-counter')).toHaveText('1 / 6');
  });

  test('Next button navigates in landscape mode', async ({ page }) => {
    await page.locator('#btn-next').tap();
    await expect(page.getByRole('heading', { name: 'C4 Architecture Diagrams' })).toBeVisible();
  });
});

// ---------------------------------------------------------------------------
// C4 Diagrams page – portrait
// ---------------------------------------------------------------------------

test.describe('iPhone – C4 Diagrams page (portrait)', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(IPHONE_PORTRAIT);
    await page.goto('/Tooda/c4');
  });

  test('has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('C4 Diagrams | Tooda');
  });

  test('all level links are visible', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'Level 1 – Context' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Level 2 – Container' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Level 3 – Component' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Level 4 – Code' })).toBeVisible();
  });

  test('Back to Home link is visible', async ({ page }) => {
    await expect(page.getByRole('link', { name: /Back to Home/ })).toBeVisible();
  });

  test('Back to Home link taps to home page', async ({ page }) => {
    await Promise.all([
      page.waitForURL(/\/Tooda\/$/),
      page.getByRole('link', { name: /Back to Home/ }).tap(),
    ]);
  });
});

// ---------------------------------------------------------------------------
// Excalidraw page – portrait
// ---------------------------------------------------------------------------

test.describe('iPhone – Excalidraw page (portrait)', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(IPHONE_PORTRAIT);
    await page.goto('/Tooda/excalidraw');
  });

  test('displays the Healthcare Platform heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Healthcare Platform' })).toBeVisible();
  });

  test('Level 1 link is visible', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'Level 1 – Context' })).toBeVisible();
  });

  test('Back to Home link is visible', async ({ page }) => {
    await expect(page.getByRole('link', { name: /Back to Home/ })).toBeVisible();
  });
});

// ---------------------------------------------------------------------------
// API Explorer page – portrait
// ---------------------------------------------------------------------------

test.describe('iPhone – API Explorer page (portrait)', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(IPHONE_PORTRAIT);
    await page.goto('/Tooda/api');
  });

  test('has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('API Explorer | Tooda');
  });

  test('Back to Home link is visible', async ({ page }) => {
    await expect(page.getByRole('link', { name: /Back to Home/ })).toBeVisible();
  });
});

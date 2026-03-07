import { test, expect } from '@playwright/test';

test.describe('Slideshow page', () => {
  test('has correct title', async ({ page }) => {
    await page.goto('/Tooda/slideshow');
    await expect(page).toHaveTitle('Slide Deck | Tooda');
  });

  test('displays the first slide on load', async ({ page }) => {
    await page.goto('/Tooda/slideshow');
    await expect(page.getByRole('heading', { name: 'Welcome to Tooda' })).toBeVisible();
  });

  test('shows slide counter starting at 1 / 6', async ({ page }) => {
    await page.goto('/Tooda/slideshow');
    await expect(page.locator('#slide-counter')).toHaveText('1 / 6');
  });

  test('Prev button is disabled on the first slide', async ({ page }) => {
    await page.goto('/Tooda/slideshow');
    await expect(page.locator('#btn-prev')).toBeDisabled();
  });

  test('Next button is enabled on the first slide', async ({ page }) => {
    await page.goto('/Tooda/slideshow');
    await expect(page.locator('#btn-next')).toBeEnabled();
  });

  test('navigates to the next slide using the Next button', async ({ page }) => {
    await page.goto('/Tooda/slideshow');
    await page.locator('#btn-next').click();
    await expect(page.getByRole('heading', { name: 'C4 Architecture Diagrams' })).toBeVisible();
    await expect(page.locator('#slide-counter')).toHaveText('2 / 6');
  });

  test('navigates back using the Prev button', async ({ page }) => {
    await page.goto('/Tooda/slideshow');
    await page.locator('#btn-next').click();
    await page.locator('#btn-prev').click();
    await expect(page.getByRole('heading', { name: 'Welcome to Tooda' })).toBeVisible();
    await expect(page.locator('#slide-counter')).toHaveText('1 / 6');
  });

  test('navigates with right arrow key', async ({ page }) => {
    await page.goto('/Tooda/slideshow');
    await page.keyboard.press('ArrowRight');
    await expect(page.getByRole('heading', { name: 'C4 Architecture Diagrams' })).toBeVisible();
  });

  test('navigates with left arrow key', async ({ page }) => {
    await page.goto('/Tooda/slideshow');
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowLeft');
    await expect(page.getByRole('heading', { name: 'Welcome to Tooda' })).toBeVisible();
  });

  test('Next button is disabled on the last slide', async ({ page }) => {
    await page.goto('/Tooda/slideshow');
    // Navigate to last slide
    for (let i = 0; i < 5; i++) {
      await page.locator('#btn-next').click();
    }
    await expect(page.locator('#btn-next')).toBeDisabled();
    await expect(page.locator('#slide-counter')).toHaveText('6 / 6');
  });

  test('all 6 slides are accessible via Next button', async ({ page }) => {
    await page.goto('/Tooda/slideshow');
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
        await page.locator('#btn-next').click();
      }
    }
  });

  test('clicking a progress dot navigates to the corresponding slide', async ({ page }) => {
    await page.goto('/Tooda/slideshow');
    // Click the 3rd dot (index 2 → slide 3)
    const dots = page.locator('#progress-dots button');
    await dots.nth(2).click();
    await expect(page.getByRole('heading', { name: 'Freehand Diagrams' })).toBeVisible();
    await expect(page.locator('#slide-counter')).toHaveText('3 / 6');
  });

  test('has a back link to the home page', async ({ page }) => {
    await page.goto('/Tooda/slideshow');
    await expect(page.getByRole('link', { name: /Back to Home/ })).toHaveAttribute('href', '/Tooda/');
  });

  test('fullscreen button is visible and has correct initial label', async ({ page }) => {
    await page.goto('/Tooda/slideshow');
    const btn = page.locator('#btn-fullscreen');
    await expect(btn).toBeVisible();
    await expect(btn).toHaveAttribute('aria-label', 'Enter Full Screen');
    await expect(btn).toContainText('Full Screen');
  });

  test('restores slide from URL hash on load', async ({ page }) => {
    await page.goto('/Tooda/slideshow#slide-4');
    await expect(page.getByRole('heading', { name: 'API Explorer' })).toBeVisible();
    await expect(page.locator('#slide-counter')).toHaveText('4 / 6');
  });
});

test.describe('Home page – Slide Deck link', () => {
  test('has a link to the slideshow page', async ({ page }) => {
    await page.goto('/Tooda/');
    await expect(page.getByRole('link', { name: /View Slide Deck/ })).toHaveAttribute('href', '/Tooda/slideshow');
  });

  test('Slide Deck link is visible on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/Tooda/');
    const link = page.getByRole('link', { name: /View Slide Deck/ });
    await expect(link).toBeVisible();
  });
});

test.describe('Home page – Slide Deck link mobile tap', () => {
  test.use({ hasTouch: true });

  test('Slide Deck link is clickable on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/Tooda/');
    const link = page.getByRole('link', { name: /View Slide Deck/ });
    await Promise.all([
      page.waitForURL(/\/Tooda\/slideshow/),
      link.tap(),
    ]);
  });
});

test.describe('Slideshow page – mobile touch navigation', () => {
  test.use({ hasTouch: true });

  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
  });

  test('Next button is enabled on the first slide on mobile', async ({ page }) => {
    await page.goto('/Tooda/slideshow');
    await expect(page.locator('#btn-next')).toBeEnabled();
  });

  test('Next button navigates to the next slide on mobile tap', async ({ page }) => {
    await page.goto('/Tooda/slideshow');
    await page.locator('#btn-next').tap();
    await expect(page.getByRole('heading', { name: 'C4 Architecture Diagrams' })).toBeVisible();
    await expect(page.locator('#slide-counter')).toHaveText('2 / 6');
  });

  test('Prev button navigates back on mobile tap', async ({ page }) => {
    await page.goto('/Tooda/slideshow');
    await page.locator('#btn-next').tap();
    await page.locator('#btn-prev').tap();
    await expect(page.getByRole('heading', { name: 'Welcome to Tooda' })).toBeVisible();
    await expect(page.locator('#slide-counter')).toHaveText('1 / 6');
  });

  test('Next button is disabled on the last slide on mobile', async ({ page }) => {
    await page.goto('/Tooda/slideshow');
    for (let i = 0; i < 5; i++) {
      await page.locator('#btn-next').tap();
    }
    await expect(page.locator('#btn-next')).toBeDisabled();
    await expect(page.locator('#slide-counter')).toHaveText('6 / 6');
  });
});

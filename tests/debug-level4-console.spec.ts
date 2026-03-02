import { test, expect } from '@playwright/test';

test('Debug Level 4 console errors', async ({ page }) => {
  const consoleMessages: string[] = [];
  page.on('console', msg => {
    consoleMessages.push(`[${msg.type()}] ${msg.text()}`);
  });
  page.on('pageerror', err => {
    consoleMessages.push(`[pageerror] ${err.message}`);
  });

  await page.goto('/Tooda/c4');
  await page.waitForTimeout(2000);

  await page.getByRole('button', { name: 'Level 4 – Code' }).click();
  await page.waitForTimeout(3000);

  const level4Html = await page.locator('#level4 .mermaid').innerHTML();
  console.log('Level 4 HTML:', level4Html.substring(0, 500));

  console.log('\n=== All console messages ===');
  for (const msg of consoleMessages) {
    console.log(msg);
  }
});

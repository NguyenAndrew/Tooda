import { test, expect } from '@playwright/test';

test('Level 4 renders SVG', async ({ page }) => {
  const consoleMessages: string[] = [];
  page.on('console', msg => {
    consoleMessages.push(`[${msg.type()}] ${msg.text()}`);
  });

  await page.goto('/Tooda/c4');
  await page.waitForTimeout(3000);

  // Check level1 renders SVG
  const level1SvgCount = await page.locator('#level1 .mermaid svg').count();
  console.log(`level1: SVG count = ${level1SvgCount}`);

  // Click level4 tab
  await page.getByRole('button', { name: 'Level 4 – Code' }).click();
  await page.waitForTimeout(3000);

  const level4SvgCount = await page.locator('#level4 .mermaid svg').count();
  const level4Html = await page.locator('#level4 .mermaid').innerHTML();
  console.log(`level4: SVG count = ${level4SvgCount}`);
  console.log(`level4 HTML snippet: ${level4Html.substring(0, 300)}`);
  console.log(`Console messages: ${consoleMessages.join('\n')}`);

  // This should succeed when properly rendered
  expect(level4SvgCount).toBeGreaterThan(0);
});

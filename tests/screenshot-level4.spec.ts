import { test, expect } from '@playwright/test';
import path from 'path';

test('Screenshot Level 4', async ({ page }) => {
  await page.goto('/Tooda/c4');
  await page.waitForTimeout(3000);
  
  await page.screenshot({ path: '/tmp/level1.png' });
  
  await page.getByRole('button', { name: 'Level 4 – Code' }).click();
  await page.waitForTimeout(3000);
  
  await page.screenshot({ path: '/tmp/level4.png' });
  
  // Also get the full SVG content
  const svgHtml = await page.locator('#level4 .mermaid').innerHTML();
  console.log('Level 4 SVG HTML length:', svgHtml.length);
  console.log('Level 4 SVG full:', svgHtml.substring(0, 1000));
});

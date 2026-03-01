import { test, expect } from '@playwright/test';

test('Level 4 renders without syntax error', async ({ page }) => {
  await page.goto('/Tooda/c4');
  
  // Click the Level 4 tab
  await page.getByRole('button', { name: 'Level 4 – Code' }).click();
  
  // Wait for mermaid to render
  await page.waitForTimeout(3000);
  
  // Get the mermaid div innerHTML
  const innerHTML = await page.$eval('#level4 .mermaid', (el: Element) => el.innerHTML);
  
  console.log('innerHTML length:', innerHTML.length);
  console.log('innerHTML preview:', innerHTML.substring(0, 300));
  
  // Check for syntax error
  expect(innerHTML).not.toContain('Syntax error');
  
  // Check that SVG was rendered
  expect(innerHTML).toContain('<svg');
  
  await page.screenshot({ path: '/tmp/level4-screenshot.png' });
});

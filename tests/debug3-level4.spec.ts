import { test, expect } from '@playwright/test';

test('Debug Level 4 - check initial render', async ({ page }) => {
  await page.goto('/Tooda/c4');
  await page.waitForTimeout(3000); // Wait for full mermaid render
  
  // Get the initial innerHTML of level4 mermaid element BEFORE clicking tab
  const initialInnerHTML = await page.$eval('#level4 .mermaid', (el: Element) => el.innerHTML);
  
  console.log('Initial innerHTML length:', initialInnerHTML.length);
  console.log('Initial contains "Syntax error":', initialInnerHTML.includes('Syntax error'));
  console.log('Initial contains SVG:', initialInnerHTML.includes('<svg'));
  
  if (initialInnerHTML.includes('Syntax error')) {
    const idx = initialInnerHTML.indexOf('Syntax error');
    console.log('Error context:', initialInnerHTML.substring(Math.max(0, idx-200), idx+300));
  }
  
  // Take screenshot at this point (before clicking tab)
  await page.screenshot({ path: '/tmp/level4-initial.png' });
});

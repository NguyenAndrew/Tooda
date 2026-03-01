import { test, expect } from '@playwright/test';

test('Debug Level 4 rendering', async ({ page }) => {
  const consoleMessages: string[] = [];
  page.on('console', msg => {
    if (msg.type() === 'error' || msg.text().includes('syntax') || msg.text().includes('Syntax') || msg.text().includes('error')) {
      consoleMessages.push(msg.text());
    }
  });
  
  await page.goto('/Tooda/c4');
  await page.waitForTimeout(2000);
  
  // Click Level 4 tab
  await page.getByRole('button', { name: 'Level 4 – Code' }).click();
  await page.waitForTimeout(3000);
  
  // Get innerHTML of the mermaid div
  const innerHTML = await page.$eval('#level4 .mermaid', (el: Element) => el.innerHTML);
  
  // Extract error message
  const errorMatch = innerHTML.match(/Syntax error[^<]*/);
  const syntaxErrorText = errorMatch ? errorMatch[0] : 'none found';
  
  console.log('SYNTAX ERROR TEXT:', syntaxErrorText);
  console.log('Console errors:', consoleMessages.slice(0, 5).join('\n'));
  
  // Get the text content of the error SVG
  const errorText = await page.$eval('#level4', (el: Element) => el.textContent?.substring(0, 500));
  console.log('Error text content:', errorText);
  
  await page.screenshot({ path: '/tmp/level4-debug.png', fullPage: false });
});

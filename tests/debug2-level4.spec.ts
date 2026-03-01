import { test, expect } from '@playwright/test';

test('Debug Level 4 - what mermaid receives', async ({ page }) => {
  await page.goto('/Tooda/c4');
  
  // Intercept mermaid.run to see what text it receives for level4
  await page.evaluate(() => {
    (window as any).__mermaidTexts = [];
    const origRun = (window as any).mermaid?.run?.bind?.((window as any).mermaid);
    if ((window as any).mermaid) {
      const orig = (window as any).mermaid.run;
      (window as any).mermaid.run = function(...args: any[]) {
        return orig.call(this, ...args);
      };
    }
  });
  
  await page.waitForTimeout(2000);
  
  // Get the initial innerHTML of level4 mermaid element
  const initialInnerHTML = await page.$eval('#level4 .mermaid', (el: Element) => el.innerHTML);
  console.log('Initial innerHTML:', initialInnerHTML.substring(0, 500));
  console.log('Initial innerHTML contains --&gt;:', initialInnerHTML.includes('--&gt;'));
  console.log('Initial innerHTML contains -->:', initialInnerHTML.includes('-->'));
  
  // Click Level 4 tab
  await page.getByRole('button', { name: 'Level 4 – Code' }).click();
  await page.waitForTimeout(3000);
  
  const finalInnerHTML = await page.$eval('#level4 .mermaid', (el: Element) => el.innerHTML);
  console.log('\nFinal innerHTML contains "Syntax error":', finalInnerHTML.includes('Syntax error'));
  console.log('Final innerHTML contains SVG:', finalInnerHTML.includes('<svg'));
  
  // Get SVG text if present
  if (finalInnerHTML.includes('Syntax error')) {
    const svgText = finalInnerHTML.match(/Syntax error[^<]*/)?.[0];
    console.log('Error text in SVG:', svgText);
  }
});

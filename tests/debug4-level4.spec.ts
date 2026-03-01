import { test, expect } from '@playwright/test';

test('Debug Level 4 - intercept mermaid parsing', async ({ page }) => {
  // Intercept what text mermaid tries to parse BEFORE mermaid.run is called
  await page.addInitScript(() => {
    (window as any).__capturedText = '';
    // We'll intercept after DOMContentLoaded
  });
  
  await page.goto('/Tooda/c4');
  
  // Before mermaid.run fires, capture the innerHTML of the level4 element
  const rawInnerHTML = await page.evaluate(() => {
    const el = document.querySelector('#level4 .mermaid');
    return el ? el.innerHTML : 'not found';
  });
  
  console.log('Raw innerHTML (first 300):', rawInnerHTML.substring(0, 300));
  console.log('Contains --&gt;:', rawInnerHTML.includes('--&gt;'));
  
  // Simulate what entityDecode does
  const decoded = await page.evaluate((html: string) => {
    // Simulate entityDecode
    const decoder = document.createElement('div');
    html = escape(html).replace(/%26/g, '&').replace(/%23/g, '#').replace(/%3B/g, ';');
    decoder.innerHTML = html;
    return unescape(decoder.textContent || '');
  }, rawInnerHTML);
  
  console.log('\nDecoded text (first 300):', decoded.substring(0, 300));
  console.log('Decoded contains -->:', decoded.includes('-->'));
  
  // Try to parse the decoded text with mermaid
  await page.waitForTimeout(2000);
  
  const parseResult = await page.evaluate(async (text: string) => {
    try {
      // @ts-ignore
      const result = await mermaid.parse(text);
      return { success: true, result: JSON.stringify(result).substring(0, 100) };
    } catch(e: any) {
      return { success: false, error: e.message || String(e) };
    }
  }, decoded);
  
  console.log('\nParse result:', JSON.stringify(parseResult));
  
  await page.waitForTimeout(1000);
});

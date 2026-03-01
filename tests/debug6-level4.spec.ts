import { test, expect } from '@playwright/test';

test('Debug Level 4 - capture decoded text', async ({ page }) => {
  let capturedDecoded = '';
  
  await page.addInitScript(() => {
    (window as any).__capturedDecoded = '';
    
    Object.defineProperty(window, 'mermaid', {
      set(val: any) {
        if (val && typeof val.run === 'function') {
          const origRun = val.run.bind(val);
          val.run = async function(config?: any) {
            // Capture what mermaid would decode from level4
            const el = document.querySelector('#level4 .mermaid') as HTMLElement;
            if (el) {
              const html = el.innerHTML;
              // Simulate entityDecode
              const decoder = document.createElement('div');
              let processed = escape(html).replace(/%26/g, '&').replace(/%23/g, '#').replace(/%3B/g, ';');
              decoder.innerHTML = processed;
              const decoded = unescape(decoder.textContent || '');
              (window as any).__capturedDecoded = decoded;
            }
            return origRun(config);
          };
        }
        Object.defineProperty(window, 'mermaid', {
          value: val,
          writable: true,
          configurable: true
        });
      },
      get() { return undefined; },
      configurable: true
    });
  });
  
  await page.goto('/Tooda/c4');
  await page.waitForTimeout(3000);
  
  const decoded = await page.evaluate(() => (window as any).__capturedDecoded || 'not captured');
  console.log('Decoded text (first 500):', decoded.substring(0, 500));
  
  if (decoded !== 'not captured') {
    // Now try to parse this with mermaid
    const parseResult = await page.evaluate(async (text: string) => {
      try {
        // @ts-ignore
        const result = await mermaid.parse(text);
        return { success: true };
      } catch(e: any) {
        return { success: false, error: e.message || String(e) };
      }
    }, decoded);
    
    console.log('Parse result:', JSON.stringify(parseResult));
  }
});

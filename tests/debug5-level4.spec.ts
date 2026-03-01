import { test, expect } from '@playwright/test';

test('Debug Level 4 - capture pre-mermaid innerHTML', async ({ page }) => {
  // Intercept mermaid initialization to capture the diagram text
  await page.addInitScript(() => {
    (window as any).__capturedDiagrams = {};
    
    // Override document.createElement for div to intercept entityDecode
    const origDC = document.createElement.bind(document);
    (document as any)._origCreateElement = origDC;
    
    // We'll override the script execution  
    Object.defineProperty(window, 'mermaid', {
      set(val: any) {
        if (val && typeof val.run === 'function') {
          const origRun = val.run.bind(val);
          val.run = async function(config?: any) {
            // Before running, capture the text from level4 mermaid element
            const el = document.querySelector('#level4 .mermaid');
            if (el) {
              (window as any).__level4InnerHTML = el.innerHTML;
              console.log('Captured level4 innerHTML:', el.innerHTML.substring(0, 200));
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
  
  const captured = await page.evaluate(() => (window as any).__level4InnerHTML || 'not captured');
  console.log('Captured innerHTML:', captured.substring(0, 400));
  console.log('Contains -->:', captured.includes('-->'));
  console.log('Contains --&gt;:', captured.includes('--&gt;'));
  
  const consoleMessages: string[] = [];
  page.on('console', msg => consoleMessages.push(msg.text()));
});

import { test, expect } from '@playwright/test';

test('Debug Level 4 - capture render error', async ({ page }) => {
  const consoleMessages: string[] = [];
  page.on('console', msg => consoleMessages.push(`[${msg.type()}] ${msg.text()}`));
  
  await page.addInitScript(() => {
    (window as any).__renderError = null;
    
    Object.defineProperty(window, 'mermaid', {
      set(val: any) {
        if (val && typeof val.run === 'function') {
          const origRun = val.run.bind(val);
          val.run = async function(config?: any) {
            try {
              return await origRun(config);
            } catch(e: any) {
              console.error('mermaid.run error:', e?.message || String(e));
              (window as any).__renderError = e?.message || String(e);
              throw e;
            }
          };
          
          // Also override parseError
          val.parseError = function(err: any, hash: any) {
            console.error('mermaid parseError:', err, JSON.stringify(hash));
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
  await page.waitForTimeout(4000);
  
  const renderError = await page.evaluate(() => (window as any).__renderError);
  console.log('Render error:', renderError);
  
  console.log('\nAll console messages:');
  consoleMessages.forEach(m => console.log(m));
});

import { test, expect } from '@playwright/test';

test('All 4 diagrams with hidden tabs', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', msg => {
    if (!msg.text().includes('[vite]')) {
      errors.push(`[${msg.type()}] ${msg.text()}`);
    }
  });

  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <head><title>Test</title></head>
    <body>
      <div id="level1" style="display:block">
        <div class="mermaid">C4Context
  title System Context
  Person(customer, "Customer", "A person")
  System(ob, "Online Banking", "Banking system")</div>
      </div>
      <div id="level4" style="display:none">
        <div class="mermaid">classDiagram
  direction TB

  class AccountsController {
    +getBalance(req, res) void
    +getTransactions(req, res) void
  }

  class AccountsService {
    -accountsRepository: AccountsRepository
    -mainframeClient: MainframeClient
    +getBalance(customerId: string) Promise~Account~
    +getTransactions(customerId: string) Promise~Transaction~
  }

  AccountsController --> AccountsService : uses</div>
      </div>
      <script src="http://localhost:4321/Tooda/mermaid.min.js"></script>
      <script>
        mermaid.initialize({ startOnLoad: false, theme: 'default' });
        mermaid.run();
      </script>
    </body>
    </html>
  `);
  
  await page.waitForTimeout(3000);
  
  const level1Svg = await page.locator('#level1 .mermaid svg').count();
  const level4Svg = await page.locator('#level4 .mermaid svg').count();
  console.log('After initial mermaid.run():');
  console.log('  level1 SVG count:', level1Svg);
  console.log('  level4 SVG count:', level4Svg);
  
  // Now simulate clicking level4 tab
  await page.evaluate(() => {
    const level4 = document.getElementById('level4') as HTMLElement;
    level4.style.display = 'block';
    
    const unrendered = Array.from(level4.querySelectorAll('.mermaid')).filter(
      (el: Element) => !el.querySelector('svg')
    );
    console.log('Unrendered count:', unrendered.length);
    if (unrendered.length > 0) {
      unrendered.forEach((el: Element) => el.removeAttribute('data-processed'));
      (window as any).mermaid.run({ nodes: unrendered });
    }
  });
  
  await page.waitForTimeout(3000);
  
  const level4SvgAfter = await page.locator('#level4 .mermaid svg').count();
  const textContent = await page.locator('#level4 .mermaid').textContent();
  console.log('After show+rerender:');
  console.log('  level4 SVG count:', level4SvgAfter);
  if (textContent?.includes('Syntax error')) console.log('  SYNTAX ERROR DETECTED');
  
  console.log('Console errors:', errors.join('\n'));
});

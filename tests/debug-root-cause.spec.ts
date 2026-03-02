import { test, expect } from '@playwright/test';

test('Hidden classDiagram renders broken then not fixed', async ({ page }) => {
  await page.setContent(`
    <!DOCTYPE html>
    <html><head><title>Test</title></head>
    <body>
      <div id="level1" style="display:block">
        <div class="mermaid">C4Context
  title Test
  Person(a, "A", "desc")</div>
      </div>
      <div id="level4" style="display:none">
        <div class="mermaid">classDiagram
  class Foo {
    +bar(id: string) void
  }</div>
      </div>
      <script src="http://localhost:4321/Tooda/mermaid.min.js"></script>
      <script>
        mermaid.initialize({ startOnLoad: false, theme: 'default' });
        mermaid.run();
      </script>
    </body></html>
  `);
  await page.waitForTimeout(2000);
  
  // Check initial state
  const level4Initial = await page.locator('#level4 .mermaid svg').count();
  const level4Text = await page.locator('#level4 .mermaid').textContent();
  console.log('Initial - Level4 SVG count:', level4Initial);
  console.log('Initial - Has error?', level4Text?.includes('Syntax error') || level4Text?.includes('error'));
  
  // Show level4 and check
  await page.evaluate(() => {
    (document.getElementById('level4') as HTMLElement).style.display = 'block';
  });
  await page.waitForTimeout(1000);
  
  const level4SvgAfterShow = await page.locator('#level4 .mermaid svg').count();
  const level4TextAfterShow = await page.locator('#level4 .mermaid').textContent();
  console.log('After show - Level4 SVG count:', level4SvgAfterShow);
  console.log('After show - Has error?', level4TextAfterShow?.includes('Syntax error'));
});

test('Isolated classDiagram renders correctly', async ({ page }) => {
  await page.setContent(`
    <!DOCTYPE html>
    <html><head><title>Test</title></head>
    <body>
      <div id="level4" style="display:block">
        <div class="mermaid">classDiagram
  class Foo {
    +bar(id: string) void
  }</div>
      </div>
      <script src="http://localhost:4321/Tooda/mermaid.min.js"></script>
      <script>
        mermaid.initialize({ startOnLoad: false, theme: 'default' });
        mermaid.run();
      </script>
    </body></html>
  `);
  await page.waitForTimeout(2000);
  
  const svgCount = await page.locator('#level4 .mermaid svg').count();
  const textContent = await page.locator('#level4 .mermaid').textContent();
  console.log('Isolated - SVG count:', svgCount);
  console.log('Isolated - Has error?', textContent?.includes('Syntax error'));
});

test('classDiagram hidden then shown with re-render fix', async ({ page }) => {
  await page.setContent(`
    <!DOCTYPE html>
    <html><head><title>Test</title></head>
    <body>
      <div id="level1" style="display:block">
        <div class="mermaid">C4Context
  title Test
  Person(a, "A", "desc")</div>
      </div>
      <div id="level4" style="display:none">
        <div class="mermaid">classDiagram
  class Foo {
    +bar(id: string) void
  }</div>
      </div>
      <script src="http://localhost:4321/Tooda/mermaid.min.js"></script>
      <script>
        mermaid.initialize({ startOnLoad: false, theme: 'default' });
        // Only render visible panels initially
        const visibleNodes = Array.from(document.querySelectorAll('.mermaid')).filter(
          el => el.closest('[style*="display:none"]') === null
        );
        mermaid.run({ nodes: visibleNodes });
      </script>
    </body></html>
  `);
  await page.waitForTimeout(2000);
  
  // Show level4 and re-render
  await page.evaluate(async () => {
    const panel = document.getElementById('level4') as HTMLElement;
    panel.style.display = 'block';
    
    const unrendered = Array.from(panel.querySelectorAll('.mermaid')).filter(
      el => !el.querySelector('svg')
    );
    console.log('Unrendered count:', unrendered.length);
    if (unrendered.length > 0) {
      unrendered.forEach(el => el.removeAttribute('data-processed'));
      await (window as any).mermaid.run({ nodes: unrendered });
    }
  });
  await page.waitForTimeout(2000);
  
  const svgCount = await page.locator('#level4 .mermaid svg').count();
  const textContent = await page.locator('#level4 .mermaid').textContent();
  console.log('After fix - SVG count:', svgCount);
  console.log('After fix - Has error?', textContent?.includes('Syntax error'));
});

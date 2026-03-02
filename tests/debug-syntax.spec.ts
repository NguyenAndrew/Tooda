import { test, expect } from '@playwright/test';

test('Debug classDiagram syntax', async ({ page }) => {
  // Test a minimal classDiagram to confirm basic rendering works
  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <head><title>Test</title></head>
    <body>
      <div class="mermaid">
classDiagram
  class Foo {
    +bar() void
  }
      </div>
      <script src="http://localhost:4321/Tooda/mermaid.min.js"></script>
      <script>
        mermaid.initialize({ startOnLoad: true });
      </script>
    </body>
    </html>
  `);
  await page.waitForTimeout(2000);
  const svgCount = await page.locator('.mermaid svg').count();
  console.log('Simple classDiagram SVG count:', svgCount);
  const html = await page.locator('.mermaid').innerHTML();
  console.log('HTML:', html.substring(0, 200));
});

test('Test with colon params', async ({ page }) => {
  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <head><title>Test</title></head>
    <body>
      <div class="mermaid">
classDiagram
  class Foo {
    +bar(id: string) void
  }
      </div>
      <script src="http://localhost:4321/Tooda/mermaid.min.js"></script>
      <script>
        mermaid.initialize({ startOnLoad: true });
      </script>
    </body>
    </html>
  `);
  await page.waitForTimeout(2000);
  const svgCount = await page.locator('.mermaid svg').count();
  console.log('Colon params SVG count:', svgCount);
  const errText = await page.locator('.mermaid').textContent();
  if (errText?.includes('Syntax error')) console.log('ERROR: Syntax error in text!');
});

test('Test with tilde generic return', async ({ page }) => {
  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <head><title>Test</title></head>
    <body>
      <div class="mermaid">
classDiagram
  class Foo {
    +bar(id string) Promise~Baz~
  }
      </div>
      <script src="http://localhost:4321/Tooda/mermaid.min.js"></script>
      <script>
        mermaid.initialize({ startOnLoad: true });
      </script>
    </body>
    </html>
  `);
  await page.waitForTimeout(2000);
  const svgCount = await page.locator('.mermaid svg').count();
  console.log('Tilde generic return SVG count:', svgCount);
  const errText = await page.locator('.mermaid').textContent();
  if (errText?.includes('Syntax error')) console.log('ERROR: Syntax error in text!');
});

test('Test with both colon params and tilde return', async ({ page }) => {
  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <head><title>Test</title></head>
    <body>
      <div class="mermaid">
classDiagram
  class Foo {
    +bar(id: string) Promise~Baz~
  }
      </div>
      <script src="http://localhost:4321/Tooda/mermaid.min.js"></script>
      <script>
        mermaid.initialize({ startOnLoad: true });
      </script>
    </body>
    </html>
  `);
  await page.waitForTimeout(2000);
  const svgCount = await page.locator('.mermaid svg').count();
  console.log('Both colon+tilde SVG count:', svgCount);
  const errText = await page.locator('.mermaid').textContent();
  if (errText?.includes('Syntax error')) console.log('ERROR: Syntax error in colon+tilde!');
});

test('Test with multi-param comma', async ({ page }) => {
  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <head><title>Test</title></head>
    <body>
      <div class="mermaid">
classDiagram
  class Foo {
    +bar(req, res) void
  }
      </div>
      <script src="http://localhost:4321/Tooda/mermaid.min.js"></script>
      <script>
        mermaid.initialize({ startOnLoad: true });
      </script>
    </body>
    </html>
  `);
  await page.waitForTimeout(2000);
  const svgCount = await page.locator('.mermaid svg').count();
  console.log('Multi-param comma SVG count:', svgCount);
  const errText = await page.locator('.mermaid').textContent();
  if (errText?.includes('Syntax error')) console.log('ERROR: Syntax error in multi-param!');
});

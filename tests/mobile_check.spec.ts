import { test, expect } from '@playwright/test';

test('c4 diagram mobile rendering', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/Tooda/c4');
  await page.waitForSelector('#level1 .mermaid svg', { state: 'visible', timeout: 15000 });
  await page.waitForTimeout(2000);
  
  const svgEl = page.locator('#level1 .mermaid svg');
  const svgStyle = await svgEl.evaluate(el => ({
    width: (el as HTMLElement).style.width,
    height: (el as HTMLElement).style.height,
    maxWidth: (el as HTMLElement).style.maxWidth,
    viewBox: el.getAttribute('viewBox'),
    attrWidth: el.getAttribute('width'),
    attrHeight: el.getAttribute('height'),
    boundingRect: JSON.stringify(el.getBoundingClientRect()),
  }));
  console.log('SVG properties:', svgStyle);
  
  await page.screenshot({ path: '/tmp/c4_mobile_test.png' });
});

test('excalidraw mobile rendering', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/Tooda/excalidraw');
  await page.waitForTimeout(5000);
  await page.screenshot({ path: '/tmp/excalidraw_mobile_test.png' });
});

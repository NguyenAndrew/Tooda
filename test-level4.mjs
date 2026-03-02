import { chromium } from '@playwright/test';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

const consoleMessages = [];
page.on('console', msg => {
  consoleMessages.push(`[${msg.type()}] ${msg.text()}`);
});

await page.goto('http://localhost:4321/Tooda/c4');
await page.waitForTimeout(3000);

// Check level1 first
const level1SvgCount = await page.locator('#level1 .mermaid svg').count();
console.log(`level1: SVG count = ${level1SvgCount}`);

// Click level4 tab
await page.getByRole('button', { name: 'Level 4 – Code' }).click();
await page.waitForTimeout(3000);

const level4SvgCount = await page.locator('#level4 .mermaid svg').count();
const level4Html = await page.locator('#level4 .mermaid').innerHTML();
console.log(`level4: SVG count = ${level4SvgCount}`);
console.log(`level4: HTML (first 300 chars) = ${level4Html.substring(0, 300)}`);

console.log('\nConsole messages:');
consoleMessages.forEach(m => console.log(m));

await browser.close();

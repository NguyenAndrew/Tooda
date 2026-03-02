import { test, expect } from '@playwright/test';

const level4Diagram = `classDiagram
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

  class AccountsRepository {
    -db: DatabaseConnection
    +findByCustomerId(customerId: string) Promise~Account~
    +findTransactions(accountId: string) Promise~Transaction~
  }

  class MainframeClient {
    -baseUrl: string
    +fetchAccount(customerId: string) Promise~Account~
    +fetchTransactions(accountId: string) Promise~Transaction~
  }

  class Account {
    +id: string
    +customerId: string
    +balance: number
    +currency: string
  }

  class Transaction {
    +id: string
    +accountId: string
    +amount: number
    +description: string
    +date: Date
  }

  AccountsController --> AccountsService : uses
  AccountsService --> AccountsRepository : uses
  AccountsService --> MainframeClient : uses
  AccountsRepository --> Account : returns
  AccountsRepository --> Transaction : returns
  MainframeClient --> Account : returns
  MainframeClient --> Transaction : returns`;

test('Full level4 diagram renders', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', msg => errors.push(`[${msg.type()}] ${msg.text()}`));

  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <head><title>Test</title></head>
    <body>
      <div class="mermaid">${level4Diagram}</div>
      <script src="http://localhost:4321/Tooda/mermaid.min.js"></script>
      <script>
        mermaid.initialize({ startOnLoad: true, logLevel: 1 });
      </script>
    </body>
    </html>
  `);
  await page.waitForTimeout(3000);
  
  const svgCount = await page.locator('.mermaid svg').count();
  console.log('SVG count:', svgCount);
  const textContent = await page.locator('.mermaid').textContent();
  if (textContent?.includes('Syntax error')) {
    console.log('SYNTAX ERROR FOUND!');
    console.log('Text content:', textContent.substring(0, 200));
  }
  console.log('Console errors:', errors.filter(e => !e.includes('[debug]')).join('\n'));
});

test('Without colons in field names', async ({ page }) => {
  const diagram = `classDiagram
  direction TB
  class AccountsService {
    String accountsRepository
    String mainframeClient
    +getBalance(string customerId) Promise~Account~
    +getTransactions(string customerId) Promise~Transaction~
  }`;
  
  await page.setContent(`
    <!DOCTYPE html>
    <html><head><title>Test</title></head>
    <body>
      <div class="mermaid">${diagram}</div>
      <script src="http://localhost:4321/Tooda/mermaid.min.js"></script>
      <script>mermaid.initialize({ startOnLoad: true });</script>
    </body></html>
  `);
  await page.waitForTimeout(2000);
  const svgCount = await page.locator('.mermaid svg').count();
  console.log('Without colons SVG count:', svgCount);
  const text = await page.locator('.mermaid').textContent();
  if (text?.includes('Syntax error')) console.log('SYNTAX ERROR - without colons');
});

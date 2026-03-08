import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:4321',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'iPhone 13',
      use: {
        ...devices['iPhone 13'],
        browserName: 'chromium',
      },
      testMatch: '**/mobile-iphone.spec.ts',
    },
  ],
  webServer: {
    command: 'npm run dev:attach',
    url: 'http://localhost:4321/Tooda',
    reuseExistingServer: !process.env.PLAYWRIGHT_NO_REUSE_SERVER,
  },
});

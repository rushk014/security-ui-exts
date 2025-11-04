import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';

// Load .env file from tests/ if it exists
dotenv.config({ path: `${__dirname}/.env` });

// Define base URL
const baseURL = process.env.RANCHER_URL || 'https://localhost:8005';
const storageState = 'tests/.auth/storageState.json';

export default defineConfig({
  testDir: './e2e',
  timeout: 60_000,
  expect: { timeout: 5_000 },
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,

  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }]
  ],

  globalSetup: require.resolve('./global-setup.ts'),

  use: {
    baseURL,
    storageState,
    headless: process.env.CI ? true : false,
    viewport: { width: 1280, height: 800 },
    actionTimeout: 20_000,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    ignoreHTTPSErrors: true,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // Optionally enable other browsers:
    // { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    // { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});

import { defineConfig, devices } from '@playwright/test';
import { env } from './env';
import { STORAGE_STATE } from './fixtures/storageState';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 4 : undefined,
  reporter: 'html',
  use: {
    baseURL: env.baseURL,
    trace: 'on-first-retry'
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'setup',
      testDir: './fixtures',
      testMatch: /.*\.setup\.ts/,
      teardown: 'teardown',
    },
    {
      name: 'teardown',
      testDir: './fixtures',
      testMatch: /.*\.teardown\.ts/,
    },
    {
      name: 'api',
      testDir: './tests/api',
      use: { baseURL: 'https://dummyjson.com' },
    },
    {
      name: 'chromium',
      testIgnore: /api\//,
      dependencies: ['setup'],
      use: { ...devices['Desktop Chrome'], storageState: STORAGE_STATE },
    },

    {
      name: 'firefox',
      testIgnore: /api\//,
      dependencies: ['setup'],
      use: { ...devices['Desktop Firefox'], storageState: STORAGE_STATE },
    },

    {
      name: 'webkit',
      testIgnore: /api\//,
      dependencies: ['setup'],
      use: { ...devices['Desktop Safari'], storageState: STORAGE_STATE },
    }
  ]
});

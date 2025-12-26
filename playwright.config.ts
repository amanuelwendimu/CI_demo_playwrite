const { defineConfig, devices } = require('@playwright/test');
const envConfig = require('./config/env.config');

const ENV = process.env.ENV || 'dev';
const baseURL = envConfig[ENV].baseURL;

module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',

  use: {
    trace: 'on-first-retry',
    actionTimeout: 30000,
    navigationTimeout: 30000,
    baseURL: baseURL,
    launchOptions: {
      slowMo: 300,         
   },
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // You can enable more browsers here:
    // { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    // { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
// const { defineConfig, devices } = require('@playwright/test');
// const envConfig = require('./config/env.config');

// const ENV = process.env.ENV || 'dev';
// const baseURL = envConfig[ENV].baseURL;

// module.exports = defineConfig({
//   testDir: './tests',
//   fullyParallel: true,
//   forbidOnly: !!process.env.CI,
//   retries: process.env.CI ? 2 : 0,
//   workers: process.env.CI ? 1 : undefined,
//   reporter: 'html',

//   use: {
//     trace: 'on-first-retry',
//     actionTimeout: 30000,
//     navigationTimeout: 30000,
//     baseURL: baseURL,
//     launchOptions: {
//       slowMo: 3000,         // 👈 Slows down each action by 300ms
//          // 👈 Optional: see the test run visually
//     },
//   },

//   projects: [
//     {
//       name: 'chromium',
//       use: { ...devices['Desktop Chrome'] },
//     },
//   ],
// });

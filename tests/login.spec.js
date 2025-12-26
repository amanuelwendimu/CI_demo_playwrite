// const { test, expect } = require('@playwright/test');
// const { LoginPage } = require('../pages/login.page');
// const envConfig = require('../config/env.config');
// const loginData = require('../data/loginData.json');
// const environment = process.env.TEST_ENV || 'dev';
// const baseURL = envConfig[environment]?.baseURL;
// if (!baseURL) {
//   throw new Error(`Invalid environment: ${environment}`);
// }

// test.describe(`Login Tests - ENV: ${environment}`, () => {
//   loginData.forEach(({ username, password }) => {
//     test(`Login test for user: ${username}`, async ({ page }) => {
//       await page.goto(baseURL);
//       const loginPage = new LoginPage(page);
//       await loginPage.login(username, password);
//       await expect(page.locator("//a[normalize-space()='Home']")).toBeVisible(); // example post-login check
//     });
//   });
// });

// const { test, expect } = require('@playwright/test');
// const { LoginPage } = require('../pages/login.page');
// const envConfig = require('../config/env.config');
// const loginData = require('../data/loginData.json');

// const environment = process.env.TEST_ENV || 'dev';
// const baseURL = envConfig[environment]?.baseURL;

// if (!baseURL) {
//   throw new Error(`Invalid environment: ${environment}`);
// }

// // Performance threshold in milliseconds
// const MAX_LOAD_TIME_MS = 15500;
// test.describe(`Performance - Base URL Load (${environment})`, () => {
//   test('should load base URL within 1.5 seconds', async ({ page }) => {
//     const startTime = Date.now();
//     await page.goto(baseURL, { waitUntil: 'load' });
//     const loadTime = Date.now() - startTime;
//     console.log(`⏱️ Base URL loaded in ${loadTime} ms`);
//     expect(
//       loadTime,
//       `❌ Base URL load time exceeded ${MAX_LOAD_TIME_MS} ms (actual: ${loadTime} ms)`
//     ).toBeLessThanOrEqual(MAX_LOAD_TIME_MS);
//   });
// });
// test.describe(`Login Tests (${environment})`, () => {
//   loginData.forEach(({ username, password }) => {
//     test(`should login successfully for user: ${username}`, async ({ page }) => {
//       await page.goto(baseURL);

//       const loginPage = new LoginPage(page);
//       await loginPage.login(username, password);

//       // Verify login success
//       await expect(page.locator("//a[normalize-space()='Home']")).toBeVisible();
//       console.log(`✅ [${username}] Login successful`);
//     });
//   });
// });
// test.describe(`Performance - Main Page Load After Login (${environment})`, () => {
//   loginData.forEach(({ username, password }) => {
//     test(`should load main page within 1.5 seconds after login for user: ${username}`, async ({ page }) => {
//       await page.goto(baseURL);
//       const loginPage = new LoginPage(page);
//       const loginStart = Date.now();
//       await loginPage.login(username, password);
//       // Wait until main page is fully visible
//       await expect(page.locator("//a[normalize-space()='Home']")).toBeVisible();
//       const mainPageLoadTime = Date.now() - loginStart;
//       console.log(`✅ [${username}] Main page loaded in ${mainPageLoadTime} ms after login`);
//       expect(
//         mainPageLoadTime,
//         `❌ Main page load time after login exceeded ${MAX_LOAD_TIME_MS} ms (actual: ${mainPageLoadTime} ms)`
//       ).toBeLessThanOrEqual(MAX_LOAD_TIME_MS);
//     });
//   });
// }




// );


const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/login.page');
const envConfig = require('../config/env.config');
const loginData = require('../data/loginData.json'); // ✅ dynamic JSON

// Determine environment
const environment = process.env.TEST_ENV || 'dev';
const baseURL = envConfig[environment]?.baseURL;

if (!baseURL) {
  throw new Error(`Invalid environment: ${environment}`);
}

test.describe(`Dynamic Login & Performance Tests (${environment})`, () => {
  loginData.forEach(({ username, password, MAX_LOAD_TIME_MS }) => {
    const maxLoad = Number(MAX_LOAD_TIME_MS);

    // ✅ 1. Test base URL performance
    test(`should load base URL within ${maxLoad / 1000}s`, async ({ page }) => {
      const startTime = Date.now();
      await page.goto(baseURL, { waitUntil: 'load' });
      const loadTime = Date.now() - startTime;
      console.log(`⏱️ Base URL loaded in ${loadTime} ms`);
      expect(
        loadTime,
        `❌ Base URL load time exceeded ${maxLoad} ms (actual: ${loadTime} ms)`
      ).toBeLessThanOrEqual(maxLoad);
    });

    // ✅ 2. Test login functionality
    test(`should login successfully for user: ${username}`, async ({ page }) => {
      await page.goto(baseURL);

      const loginPage = new LoginPage(page);
      await loginPage.login(username, password);

      // Verify login success
      await expect(page.locator("//a[normalize-space()='Home']")).toBeVisible();
      console.log(`✅ [${username}] Login successful`);
    });

    // ✅ 3. Test main page load time after login
    test(`should load main page within ${maxLoad / 1000}s after login for user: ${username}`, async ({ page }) => {
      await page.goto(baseURL);

      const loginPage = new LoginPage(page);
      const loginStart = Date.now();
      await loginPage.login(username, password);

      // Wait until main page visible
      await expect(page.locator("//a[normalize-space()='Home']")).toBeVisible();

      const mainPageLoadTime = Date.now() - loginStart;
      console.log(`✅ [${username}] Main page loaded in ${mainPageLoadTime} ms after login`);
      expect(
        mainPageLoadTime,
        `❌ Main page load time exceeded ${maxLoad} ms (actual: ${mainPageLoadTime} ms)`
      ).toBeLessThanOrEqual(maxLoad);
    });
  });
});

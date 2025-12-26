// const { test, expect } = require('@playwright/test');
// const { DemoLoginPage } = require('../pages/loginDemo.page');
// const envConfig = require('../config/env.config');

// const environment = process.env.TEST_ENV || 'dev';
// const baseURL = envConfig[environment]?.baseURL;

// if (!baseURL) {
//   throw new Error(`Invalid environment: ${environment}`);
// }
// const MAX_LOAD_TIME_MS = 15500; 
// test.describe(`Login Tests - ENV: ${environment}`, () => {
//   test(`Demo Login test - Response time <= ${MAX_LOAD_TIME_MS / 1000} sec`, async ({ page }) => {
//     await page.goto(baseURL);
//     const demoLoginPage = new DemoLoginPage(page);
//     const startTime = Date.now(); // start timer
//     await demoLoginPage.login();

//     // wait for a post-login element to appear
//     await expect(page.locator("//a[normalize-space()='Home']")).toBeVisible();

//     const endTime = Date.now(); // end timer
//     const responseTime = endTime - startTime; // in milliseconds

//     console.log(`Demo login response time: ${responseTime} ms`);
//     expect(responseTime).toBeLessThanOrEqual(MAX_LOAD_TIME_MS);
//   });
// });


const { test, expect } = require('@playwright/test');
const { DemoLoginPage } = require('../pages/loginDemo.page');
const envConfig = require('../config/env.config');
const DemoLoginData = require('../data/DemologinData.json'); 


const environment = process.env.TEST_ENV || 'dev';
const baseURL = envConfig[environment]?.baseURL;

if (!baseURL) {
  throw new Error(`Invalid environment: ${environment}`);
}


const MAX_LOAD_TIME_MS = Number(DemoLoginData[0].MAX_LOAD_TIME_MS);

test.describe(`Login Tests - ENV: ${environment}`, () => {
  test(`Demo Login test - Response time <= ${MAX_LOAD_TIME_MS / 1000} sec`, async ({ page }) => {
    await page.goto(baseURL);
    const demoLoginPage = new DemoLoginPage(page);

    const startTime = Date.now(); 
    await demoLoginPage.login();
    await expect(page.locator("//a[normalize-space()='Home']")).toBeVisible();
    const endTime = Date.now(); 
    const responseTime = endTime - startTime; 

    console.log(`Demo login response time: ${responseTime} ms`);
    expect(responseTime).toBeLessThanOrEqual(MAX_LOAD_TIME_MS);
  });
});

const { test: base, expect } = require('@playwright/test');
const { LoginPage } = require('../../pages/login.page');
const envConfig = require('../../config/env.config');
const loginData = require('../../data/loginData.json');

const environment = process.env.TEST_ENV || 'dev';
const baseURL = envConfig[environment]?.baseURL;

if (!baseURL) {
  throw new Error(`Invalid environment: ${environment}`);
}

const test = base.extend({
  loggedInPage: async ({ page }, use) => {
    const { username, password } = loginData[0];
    await page.goto(baseURL);
    const loginPage = new LoginPage(page);
    await loginPage.login(username, password);
    await use(page); // makes it available to tests
  }
});

module.exports = { test, expect };



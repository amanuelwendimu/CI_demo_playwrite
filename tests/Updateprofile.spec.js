
const { test, expect } = require('./fixtures/baseTest');
const { UpdateprofilePage } = require('../pages/UpdateProfile.page');
const UpdateprofileData = require('../data/UpdateprofileData.json');
let updateprofilePage;
test.describe.serial('Update User Profile Flow', () => {

  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    // login
    const { LoginPage } = require('../pages/login.page');
    const envConfig = require('../config/env.config');
    const loginData = require('../data/loginData.json');
    const environment = process.env.TEST_ENV || 'dev';
    const baseURL = envConfig[environment]?.baseURL;
    await page.goto(baseURL);
    const loginPage = new LoginPage(page);
    await loginPage.login(loginData[0].username, loginData[0].password);
    updateprofilePage = new UpdateprofilePage(page);
  });
  test('Update Profile Test  ' , async () => {
    const data = UpdateprofileData[0];  // Read from JSON

    await updateprofilePage.navigateToProfile();
    await updateprofilePage.Updateprofiel(data);
  });

});

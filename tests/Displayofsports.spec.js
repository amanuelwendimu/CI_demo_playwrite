
const { test, expect } = require('@playwright/test');
const { DisplaysportsPage } = require('../pages/Displayofsports.page');
const { LoginPage } = require('../pages/login.page');
const envConfig = require('../config/env.config');
const testData = require('../data/loginData.json');
const inplayData = require('../data/InplayEventData.json'); // ✅ Performance thresholds

test.describe.serial('Display of 6 Core Sports & Wise Sports Pages', () => {
  let page;
  let displaysportsPage;

  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    page = await context.newPage();

    // ✅ Load environment config
    const environment = process.env.TEST_ENV || 'dev';
    const baseURL = envConfig[environment]?.baseURL;
    if (!baseURL) throw new Error(`Invalid environment: ${environment}`);

    // ✅ Go to base URL and log in
    await page.goto(baseURL);
    const loginPage = new LoginPage(page);
    await loginPage.login(testData[0].username, testData[0].password);

    displaysportsPage = new DisplaysportsPage(page);
  });

  // ----------------------------
  // Core Sports Tests
  // ----------------------------
  test('Navigate to Cricket sport', async () => {
    await displaysportsPage.navigateToCricket();
    console.log('✅ Navigated to Cricket');
  });

  test('Navigate to Soccer sport', async () => {
    await displaysportsPage.navigateToSoccer();
    console.log('✅ Navigated to Soccer');
  });

  test('Navigate to Tennis sport', async () => {
    await displaysportsPage.navigateToTennis();
    console.log('✅ Navigated to Tennis');
  });

  test('Navigate to Horse Racing sport', async () => {
    await displaysportsPage.navigateToHorseRacing();
    console.log('✅ Navigated to Horse Racing');
  });
  test('Navigate to Basketball sport', async () => {
    await displaysportsPage.navigateToBasketball();
    console.log('✅ Navigated to Basketball');
  });
  test('Navigate to Greyhound Racing sport', async () => {
    await displaysportsPage.navigateToGreyhoundRacing();
    console.log('✅ Navigated to Greyhound Racing');
  });
  test(`Display of Inplay Events page - Load time <= ${inplayData[0].MAX_LOAD_TIME_MS / 1000}s`, async () => {
    const MAX_LOAD_TIME_MS = Number(inplayData[0].MAX_LOAD_TIME_MS);

    const startTime = Date.now();
    await displaysportsPage.navigateToInplay();
    await expect(page.locator("//span[contains(text(),'In-Play')]")).toBeVisible();
    const endTime = Date.now();

    const responseTime = endTime - startTime;
    console.log(`✅ Inplay page load time: ${responseTime} ms`);

    expect(responseTime).toBeLessThanOrEqual(MAX_LOAD_TIME_MS);
  });

  
  test(`Display of Wise Soccer page - Load time <= ${inplayData[0].MAX_LOAD_TIME_MS / 1000}s`, async () => {
    const MAX_LOAD_TIME_MS = Number(inplayData[0].MAX_LOAD_TIME_MS);

    const startTime = Date.now();
    await displaysportsPage.navigateToWiseSoccer();
    await expect(page.locator("//a[@class='nav-item'][normalize-space()='Soccer']")).toBeVisible();
    const endTime = Date.now();

    const responseTime = endTime - startTime;
    console.log(`✅ Wise Soccer page load time: ${responseTime} ms`);

    expect(responseTime).toBeLessThanOrEqual(MAX_LOAD_TIME_MS);
  });

  test(`Display of Wise Tennis page - Load time <= ${inplayData[0].MAX_LOAD_TIME_MS / 1000}s`, async () => {
    const MAX_LOAD_TIME_MS = Number(inplayData[0].MAX_LOAD_TIME_MS);

    const startTime = Date.now();
    await displaysportsPage.navigateToWiseTennis();
    await expect(page.locator("//a[@class='nav-item'][normalize-space()='Tennis']")).toBeVisible();
    const endTime = Date.now();

    const responseTime = endTime - startTime;
    console.log(`✅ Wise Tennis page load time: ${responseTime} ms`);

    expect(responseTime).toBeLessThanOrEqual(MAX_LOAD_TIME_MS);
  });

  test(`Display of Wise Cricket page - Load time <= ${inplayData[0].MAX_LOAD_TIME_MS / 1000}s`, async () => {
    const MAX_LOAD_TIME_MS = Number(inplayData[0].MAX_LOAD_TIME_MS);

    const startTime = Date.now();
    await displaysportsPage.navigateToWiseCricket();
    await expect(page.locator("//a[@class='nav-item'][normalize-space()='Cricket']")).toBeVisible();
    const endTime = Date.now();

    const responseTime = endTime - startTime;
    console.log(`✅ Wise Cricket page load time: ${responseTime} ms`);

    expect(responseTime).toBeLessThanOrEqual(MAX_LOAD_TIME_MS);
  });
test(`Display of Market Page - Load time <= ${inplayData[0].MAX_LOAD_TIME_MS / 1000}s`, async () => {
  const MAX_LOAD_TIME_MS = Number(inplayData[0].MAX_LOAD_TIME_MS);

  const startTime = Date.now();

  // 1️⃣ Navigate to In-Play page
  await displaysportsPage.navigateToInplay();

  // 2️⃣ Click the first event dynamically
  await displaysportsPage.openFirstEvent();

 
  await expect(
  page.locator("//button[@id='All Markets' or contains(text(),'Matched')]")
).toBeVisible({ timeout: MAX_LOAD_TIME_MS });

  const endTime = Date.now();
  const responseTime = endTime - startTime;

  console.log(`✅ Market Page load time: ${responseTime} ms`);

  expect(responseTime).toBeLessThanOrEqual(MAX_LOAD_TIME_MS);
});



});


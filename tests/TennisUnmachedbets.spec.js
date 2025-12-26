
const { test, expect } = require('./fixtures/baseTest');
const { TennisPage } = require('../pages/Tennis.page');
const PayloadData = require('../data/Payload.json');

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function round2(num) {
  return Number(num.toFixed(2));
}

test.describe.serial('Tennis Bets Flow', () => {

  let tennisPage;                 
  let balanceBefore, exposureBefore, avltobetBefore;
  let balanceAfter, exposureAfter, avltobetAfter;

  let betExecuted = false;

  // running exposure trackers
  let expectedBackExposure = 0;
  let expectedLayExposure = 0;
  let expectedAvailToBet = 0;

  let eventName = "";            // ✔️ needed but missing
  let testData = PayloadData;    // ✔️ alias for clarity

  let betHistory = [];

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

    // ✔️ FIX: proper instance initialization
    tennisPage = new TennisPage(page);

    // ✔️ capture event name later when on event page
  });

  

  test('Check balance/exposure before placing bets', async () => {
    await delay(2000);

    balanceBefore = await tennisPage.getBalanceNumber();
    exposureBefore = await tennisPage.getExposureText();
    avltobetBefore = await tennisPage.getAvailableBalanceText();

    expectedBackExposure = 0;
    expectedLayExposure = 0;
    expectedAvailToBet = avltobetBefore;

    console.log("---- Initial Values ----");
    console.table([{
      Balance: balanceBefore,
      Exposure: exposureBefore,
      "Avail to Bet": avltobetBefore
    }]);
  });



  test('Navigate to Tennis Event', async () => {
    await tennisPage.navigateTotennisBet();   // ✔️ FIXED
    eventName = await tennisPage.getEventName();

    console.log("Navigate to Tennis event:", eventName);
  });



  test('Place Unmatched Tennis back bets', async () => {

    for (const { stake, backodd } of PayloadData) {
      const stakeVal = Number(stake);
      const backOddVal = Number(backodd);

      const result = await tennisPage.placeUnmatchedTennisBackBet(stakeVal, backOddVal);
      console.log(result.message);

      if (tennisPage.betPlaced) {

        betExecuted = true;
        const expectedProfit = round2((backOddVal - 1) * stakeVal);
        const expectedLiability = round2(stakeVal);

        expectedBackExposure += expectedLiability;
        expectedAvailToBet -= expectedLiability;

        betHistory.push({
          Type: "Back",
          Odd: backOddVal,
          Stake: stakeVal,
          Profit: `+${expectedProfit}`,
          Liability: `-${expectedLiability}`,
          "Back Exposure": -expectedBackExposure,
          "Lay Exposure": "",
          "Total Exposure": -(expectedBackExposure + expectedLayExposure),
          "Avail Balance": round2(expectedAvailToBet),
          Balance: balanceBefore
        });

        expect(result.profit).toBeCloseTo(expectedProfit, 2);

        await delay(1000);
        const toastTextBack = await tennisPage.waitForToastMessage();
        console.log("Toast after unmatched back bet:", toastTextBack || "No toast appeared");
      }
    }
  });

  // ------------------------------------------------------------------

  test('Place Unmatched Tennis lay bets', async () => {

    for (const { stake, layodd } of PayloadData) {
      const stakeVal = Number(stake);
      const layOddVal = Number(layodd);

      const result = await tennisPage.placeUnmatchedTennisLayBet(stakeVal, layOddVal);
      console.log(result.message);

      if (tennisPage.betPlaced) {

        betExecuted = true;
        const expectedProfit = round2(stakeVal);
        const expectedLiability = round2((layOddVal - 1) * stakeVal);

        expectedLayExposure += expectedLiability;
        expectedAvailToBet -= expectedLiability;

        betHistory.push({
          Type: "Lay",
          Odd: layOddVal,
          Stake: stakeVal,
          Profit: `+${expectedProfit}`,
          Liability: `-${expectedLiability}`,
          "Back Exposure": "",
          "Lay Exposure": -expectedLayExposure,
          "Total Exposure": -(expectedBackExposure + expectedLayExposure),
          "Avail Balance": round2(expectedAvailToBet),
          Balance: balanceBefore
        });

        expect(result.liability).toBeCloseTo(expectedLiability, 2);

        await delay(1000);
        const toastTextLay = await tennisPage.waitForToastMessage();
        console.log("Toast after unmatched lay bet:", toastTextLay || "No toast appeared");
      }
    }
  });
  test('Check balance/exposure after placing bets', async () => {
    await delay(3000);
    balanceAfter = await tennisPage.getBalanceNumber();
    exposureAfter = await tennisPage.getExposureText();
    avltobetAfter = await tennisPage.getAvailableBalanceText();
    console.log("---- Bet History ----");
    console.table(betHistory);
    console.log("---- Exposure Summary ----");
    console.table([{
      "Back Exposure": -expectedBackExposure,
      "Lay Exposure": -expectedLayExposure,
      "Expected Total Exposure": -(expectedBackExposure + expectedLayExposure)
    }]);
    console.log("---- Final Values ----");
    console.table([{
      "Main Balance Before": balanceBefore,
      "Main Balance After": balanceAfter,
      "Avail Before": avltobetBefore,
      "Avail After": avltobetAfter,
      "Exposure Before ":exposureBefore,
        "Exposure After " :exposureAfter
    }]);
     if (betExecuted) {
        expect(Math.round(exposureAfter)).not.toBe(Math.round(exposureBefore));
        
      } else {
        console.log("No bets were placed. Skipping exposure validation.");
      }
    
  });

});








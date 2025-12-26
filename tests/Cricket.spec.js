
const { test, expect } = require('./fixtures/baseTest');
const { CricketPage } = require('../pages/cricket.page');
const PayloadData = require('../data/Payload.json');

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function round2(num) {
  return Number(num.toFixed(2));
}

test.describe.serial('Cricket Bets Flow', () => {

  let cricketPage;                 
  let balanceBefore, exposureBefore, avltobetBefore;
  let balanceAfter, exposureAfter, avltobetAfter;

  let betExecuted = false;

  // running exposure trackers
  let expectedBackExposure = 0;
  let expectedLayExposure = 0;
  let expectedAvailToBet = 0;

  let eventName = "";            
  let testData = PayloadData;   
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

    cricketPage = new CricketPage(page);
  });

  // ------------------------------------------------------------------

  test('Check balance/exposure before placing bets', async () => {
    await delay(2000);

    balanceBefore = await cricketPage.getBalanceNumber();
    exposureBefore = await cricketPage.getExposureText();
    avltobetBefore = await cricketPage.getAvailableBalanceText();
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

  // ------------------------------------------------------------------

  test('Navigate to Cricket Event', async () => {
    await cricketPage.navigateTocricketBet();   
    eventName = await cricketPage.getEventName();
    console.log("Navigate to Cricket event:", eventName);
  });

  // ------------------------------------------------------------------

  test('Place Cricket Back bet', async () => {
    const stakeVal = Number(testData[0].stake);

    const result = await cricketPage.placeCricketBackBet(stakeVal);
    console.log(result.message);

    if (cricketPage.betPlaced) {
      betExecuted = true;
      const odd = result.odd;
      const expectedProfit = round2((odd - 1) * stakeVal);
      const expectedLiability = round2(stakeVal);

      expectedBackExposure += expectedLiability;
      expectedAvailToBet -= expectedLiability;

      betHistory.push({
        Event: eventName,
        Type: "Back",
        Odd: odd,
        Stake: stakeVal,
        Profit: `+${expectedProfit}`,
        Liability: `-${expectedLiability}`,
        "Back Exposure": -expectedBackExposure,
        "Lay Exposure": "",
        "Avail Balance": round2(expectedAvailToBet),
        Balance: balanceBefore
      });

      expect(result.profit).toBeCloseTo(expectedProfit, 2);

      await delay(1000);
      const toastTextBack = await cricketPage.waitForToastMessage();
      console.log("Toast after back bet:", toastTextBack || "No toast appeared");
    }
  });

  // ------------------------------------------------------------------

  test('Place Cricket Lay bet', async () => {
    const stakeVal = Number(testData[0].stake);

    const result = await cricketPage.placeCricketLayBet(stakeVal);
    console.log(result.message);

    if (cricketPage.betPlaced) {
      betExecuted = true;

      const odd = result.odd;
      const expectedLiability = round2((odd - 1) * stakeVal);

      expectedLayExposure += expectedLiability;
      expectedAvailToBet -= expectedLiability;

      betHistory.push({
        Event: eventName,
        Type: "Lay",
        Odd: odd,
        Stake: stakeVal,
        Profit: `-${expectedLiability}`,
        Liability: `-${expectedLiability}`,
        "Back Exposure": "",
        "Lay Exposure": -expectedLayExposure,
        "Avail Balance": round2(expectedAvailToBet),
        Balance: balanceBefore
      });

      expect(result.liability).toBeCloseTo(expectedLiability, 2);

      await delay(1000);
      const toastTextLay = await cricketPage.waitForToastMessage();
      console.log("Toast after lay bet:", toastTextLay || "No toast appeared");
    }
  });



  test('Check balance/exposure after placing bets', async () => {
    await delay(3000);

    balanceAfter = await cricketPage.getBalanceNumber();
    exposureAfter = await cricketPage.getExposureText();
    avltobetAfter = await cricketPage.getAvailableBalanceText();

    console.log("---- Bet History ----");
    console.table(
      betHistory.map(row => {
        delete row["Total Exposure"]; // remove Total Exposure
        return row;
      })
    );

    console.log("---- Individual Exposure Summary ----");
    console.table([{
      "Back Exposure": -expectedBackExposure,
      "Lay Exposure": -expectedLayExposure
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







const { test, expect } = require('./fixtures/baseTest');
const { NextgrayhoundracePage } = require('../pages/nextgrayhoundrace.page');
const PayloadData = require('../data/Payload.json');

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }
function round2(n) { return Number(n.toFixed(2)); }

test.describe.serial("Next Gray hound Race Bets Flow @smoke", () => {

  let grayHoundRacePage;
  let balanceBefore, exposureBefore, avltobetBefore;
  let balanceAfter, exposureAfter, avltobetAfter;
  let betExecuted = false;
  let expectedBackExposure = 0;
  let expectedLayExposure = 0;
  let expectedAvailToBet = 0;
  let eventName = "";
  let testData = PayloadData;
  let betHistory = [];

  // ----------------------------------------------------------

  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    // Login

    const { LoginPage } = require('../pages/login.page');
    const envConfig = require('../config/env.config');
    const loginData = require('../data/loginData.json');

    const environment = process.env.TEST_ENV || 'dev';
    const baseURL = envConfig[environment]?.baseURL;
    await page.goto(baseURL);
    const loginPage = new LoginPage(page);
    await loginPage.login(loginData[0].username, loginData[0].password);
    grayHoundRacePage = new NextgrayhoundracePage(page);
  });

  

  test("Check balance/exposure before placing bets", async () => {
    await delay(2000);

    balanceBefore = await grayHoundRacePage.getBalanceNumber();
    exposureBefore = await grayHoundRacePage.getExposureText();
    avltobetBefore = await grayHoundRacePage.getAvailableBalanceText();

    expectedAvailToBet = avltobetBefore;

    console.log("---- Initial Values ----");
    console.table([{ balanceBefore, exposureBefore, avltobetBefore }]);
  });
  test("Navigate to Gray Hound Race Event", async () => {
    await grayHoundRacePage.navigateTograyhoundeBet();
    eventName = await grayHoundRacePage.getEventName();
    console.log("Navigated to:", eventName);
  });
  test("Place grayhound Back Bet", async () => {
    const stakeVal = Number(testData[0].stake);

    const result = await grayHoundRacePage.placenextgrayhoundBackBet(stakeVal);
    console.log(result.message);

    if (grayHoundRacePage.betPlaced) {
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
        Profit: expectedProfit,
        Liability: expectedLiability
      });

      await delay(1000);
      await grayHoundRacePage.waitForToastMessage();
    }
  });
  
  test("Check balance/exposure after placing bets", async () => {
    await delay(3000);

    balanceAfter = await grayHoundRacePage.getBalanceNumber();
    exposureAfter = await grayHoundRacePage.getExposureText();
    avltobetAfter = await grayHoundRacePage.getAvailableBalanceText();

    console.log("---- Bet Summary ----");
    console.table(betHistory);

    console.log("---- Bet Summary ----");
    console.table(betHistory);
 console.log("---- Exposure Summary ----");
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


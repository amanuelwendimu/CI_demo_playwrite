const { test, expect } = require('./fixtures/baseTest');
const { NextHorseracePage } = require('../pages/nexthorserace.page');
const PayloadData = require('../data/Payload.json');

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }
function round2(n) { return Number(n.toFixed(2)); }

test.describe.serial("Next Horse Race Bets Flow", () => {

  let horseRacePage;
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
    horseRacePage = new NextHorseracePage(page);
  });

  

  test("Check balance/exposure before placing bets", async () => {
    await delay(2000);

    balanceBefore = await horseRacePage.getBalanceNumber();
    exposureBefore = await horseRacePage.getExposureText();
    avltobetBefore = await horseRacePage.getAvailableBalanceText();

    expectedAvailToBet = avltobetBefore;

    console.log("---- Initial Values ----");
    console.table([{ balanceBefore, exposureBefore, avltobetBefore }]);
  });
  test("Navigate to Horse Race Event", async () => {
    await horseRacePage.navigateTohorseBet();
    eventName = await horseRacePage .getEventName();
    console.log("Navigated to:", eventName);
  });
test("Place Unmatched Horse Race Back Bets", async () => {
    for (const { stake, backodd } of testData) {
      const stakeVal = Number(stake);
      const oddVal = Number(backodd);
      const result = await horseRacePage.placeUnmatchedNextHorseraceBackBet(stakeVal, oddVal);
      console.log(result.message);
      if (horseRacePage.betPlaced) {
        betExecuted = true;
        const expectedLiability = round2(stakeVal);
        expectedBackExposure += expectedLiability;
        expectedAvailToBet -= expectedLiability;

        betHistory.push({
          Type: "Back (Unmatched)",
          Odd: oddVal,
          Stake: stakeVal
        });

        await delay(1000);
      }
    }
  });

  test("Check balance/exposure after placing bets", async () => {
    await delay(3000);
    balanceAfter = await horseRacePage.getBalanceNumber();
    exposureAfter = await horseRacePage.getExposureText();
    avltobetAfter = await horseRacePage.getAvailableBalanceText();

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


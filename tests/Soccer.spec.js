const { test, expect } = require('./fixtures/baseTest');
const { SoccerPage } = require('../pages/soccer.page');
const PayloadData = require('../data/Payload.json');

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }
function round2(n) { return Number(n.toFixed(2)); }

test.describe.serial("SOCCER Bets Flow @smoke", () => {

  let soccerPage;

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

    // ✔️ Correct instance creation
    soccerPage = new SoccerPage(page);
  });

  // ----------------------------------------------------------

  test("Check balance/exposure before placing bets", async () => {
    await delay(2000);

    balanceBefore = await soccerPage.getBalanceNumber();
    exposureBefore = await soccerPage.getExposureText();
    avltobetBefore = await soccerPage.getAvailableBalanceText();

    expectedAvailToBet = avltobetBefore;

    console.log("---- Initial Values ----");
    console.table([{ balanceBefore, exposureBefore, avltobetBefore }]);
  });

  // ----------------------------------------------------------

  test("Navigate to Soccer Event", async () => {
    await soccerPage.navigateTosoccerBet();
    eventName = await soccerPage.getEventName();
    console.log("Navigated to:", eventName);
  });

  // ----------------------------------------------------------

  test("Place Soccer Back Bet", async () => {
    const stakeVal = Number(testData[0].stake);

    const result = await soccerPage.placeSoccerBackBet(stakeVal);
    console.log(result.message);

    if (soccerPage.betPlaced) {
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
      await soccerPage.waitForToastMessage();
    }
  });

  // ----------------------------------------------------------

  test("Place Soccer Lay Bet", async () => {
    const stakeVal = Number(testData[0].stake);

    const result = await soccerPage.placeSoccerLayBet(stakeVal);
    console.log(result.message);

    if (soccerPage.betPlaced) {
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
        Liability: expectedLiability
      });

      await delay(1000);
      await soccerPage.waitForToastMessage();
    }
  });
  test('Check balance/exposure after placing bets', async () => {
      await delay(3000);
      balanceAfter = await soccerPage.getBalanceNumber();
      exposureAfter = await soccerPage.getExposureText();
      avltobetAfter = await soccerPage.getAvailableBalanceText();
  
      console.log("---- Bet History ----");
      console.table(
        betHistory.map(row => {
          //delete row["Total Exposure"]; // remove Total Exposure
          return row;
        })
      );
  
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






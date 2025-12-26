const { test, expect } = require('./fixtures/baseTest');
const { SoccerPage } = require('../pages/soccer.page');
const PayloadData = require('../data/Payload.json');

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }
function round2(n) { return Number(n.toFixed(2)); }

test.describe.serial("SOCCER Bets Flow", () => {

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

  test("Place Unmatched Soccer Back Bets", async () => {
    for (const { stake, backodd } of testData) {
      const stakeVal = Number(stake);
      const oddVal = Number(backodd);

      const result = await soccerPage.placeUnmatchedSoccerBackBet(stakeVal, oddVal);
      console.log(result.message);

      if (soccerPage.betPlaced) {
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

  // ----------------------------------------------------------

  test("Place Unmatched Soccer Lay Bets", async () => {
    for (const { stake, layodd } of testData) {
      const stakeVal = Number(stake);
      const oddVal = Number(layodd);

      const result = await soccerPage.placeUnmatchedSoccerLayBet(stakeVal, oddVal);
      console.log(result.message);

      if (soccerPage.betPlaced) {
        betExecuted = true;

        const expectedLiability = round2((oddVal - 1) * stakeVal);
        expectedLayExposure += expectedLiability;
        expectedAvailToBet -= expectedLiability;

        betHistory.push({
          Type: "Lay (Unmatched)",
          Odd: oddVal,
          Stake: stakeVal
        });

        await delay(1000);
      }
    }
  });

  // ----------------------------------------------------------

  test("Check balance/exposure after placing bets", async () => {
    await delay(3000);

    balanceAfter = await soccerPage.getBalanceNumber();
    exposureAfter = await soccerPage.getExposureText();
    avltobetAfter = await soccerPage.getAvailableBalanceText();

    console.log("---- Bet Summary ----");
    console.table(betHistory);

   if (betExecuted) {
        expect(Math.round(exposureAfter)).not.toBe(Math.round(exposureBefore));
        
      } else {
        console.log("No bets were placed. Skipping exposure validation.");
      }
  });

});






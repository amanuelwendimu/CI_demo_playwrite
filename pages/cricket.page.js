const { expect } = require('@playwright/test');

exports.CricketPage = class CricketPage {
  constructor(page) {
    this.page = page;
    this.cricketLink = page.locator('app-header').getByRole('link', { name: 'Cricket' });
    this.marketLink = page.locator("(//a[contains(@class, 'event')])[2]");
    //this.allMarkets = page.locator("button[id='All Markets']");
    this.allMarkets = page.getByRole('button', { name: 'All Markets' });
    this.cricketBackOddButton = page.locator("body > app-root:nth-child(1) > app-pages:nth-child(3) > div:nth-child(1) > div:nth-child(2) > app-main:nth-child(2) > mat-drawer-container:nth-child(2) > mat-drawer-content:nth-child(4) > app-content:nth-child(2) > app-market-layout:nth-child(2) > div:nth-child(1) > div:nth-child(3) > mat-accordion:nth-child(1) > app-market:nth-child(1) > mat-expansion-panel:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > app-market-runners:nth-child(1) > div:nth-child(1) > div:nth-child(1) > table:nth-child(1) > tbody:nth-child(2) > tr:nth-child(1) > td:nth-child(4) > a:nth-child(1) > span:nth-child(1)");
    this.cricketLayOddButton = page.locator("body > app-root:nth-child(1) > app-pages:nth-child(3) > div:nth-child(1) > div:nth-child(2) > app-main:nth-child(2) > mat-drawer-container:nth-child(2) > mat-drawer-content:nth-child(4) > app-content:nth-child(2) > app-market-layout:nth-child(2) > div:nth-child(1) > div:nth-child(3) > mat-accordion:nth-child(1) > app-market:nth-child(1) > mat-expansion-panel:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > app-market-runners:nth-child(1) > div:nth-child(1) > div:nth-child(1) > table:nth-child(1) > tbody:nth-child(2) > tr:nth-child(1) > td:nth-child(5) > a:nth-child(1) > span:nth-child(2)");

    this.stakeInput = page.locator("input[placeholder='stake']");
    this.placeBetButton = page.locator("//button[.//span[normalize-space()='Place Bet']]");
    this.balance = page.locator("//span[@class='balance-value text-balance balance-val']");
    this.exposure = page.locator("app-balance-display div:nth-child(4) > span:nth-child(2)");
    this.avltobetBalance = page.locator("app-balance-display div:nth-child(6) > span:nth-child(2)");
    this.toastMessage = page.locator("div.hot-toast-message div:nth-child(1)");
    this.odd = page.locator("input.price-input");
    this.odd2 = page.locator("input.price-input").nth(1);
    this.suspended = page.getByLabel('Match Odds - Matched:').locator('div').filter({ hasText: /^Suspended$/ });
    this.closed = page.getByLabel('Match Odds - Matched:').locator('div').filter({ hasText: /^Closed$/ });
    this.errorMessage = page.locator("//div[@class='error-message']"); 
    this.eventname = page.locator("a[class='event-title text-secondary'] b");
    //this.Noodds = page.locator("//*[normalize-space(text())='-']");
    this.betPlaced = false;
    

  }
  async navigateTocricketBet() {
    await this.cricketLink.click();
    await this.marketLink.click();
    await this.allMarkets.click();
  }
async getEventName() {
    return this.eventname.innerText();
  }
  // async isMarketAvailable() {
  //   if (await this.suspended.isVisible()) return "Suspended";
  //   if (await this.closed.isVisible()) return "Closed";
  //   return "Open";
  // }
  async isMarketAvailable() {
  if (await this.suspended.isVisible()) return "Suspended";
  if (await this.closed.isVisible()) return "Closed";
  
  // ✅ Check if odds are missing even though market is open
  const backOddVisible = await this.cricketBackOddButton.isVisible().catch(() => false);
  const layOddVisible = await this.cricketLayOddButton.isVisible().catch(() => false);
 
  if (!backOddVisible && !layOddVisible) {
    return "No Odds";
  }

  return "Open";
}

  async placeCricketBackBet(stake) {
    const marketState = await this.isMarketAvailable();
    if (marketState !== "Open") {
      this.betPlaced = false;
      return { message: `Back bet not placed. Market is ${marketState}` };
    }
    await this.cricketBackOddButton.click();
    await this.stakeInput.fill('');
    await this.stakeInput.type(stake.toString());
    const odd = await this.getOddValue();
    const stakeVal = parseFloat(stake);
    const profit = (odd - 1) * stakeVal;
    if (await this.errorMessage.isVisible()) {
      const msg = (await this.errorMessage.textContent())?.trim();
      this.betPlaced = false;
      return { message: `Back bet not placed: ${msg}` };
    }
    await expect(this.placeBetButton).toBeEnabled({ timeout: 5000 });
    await this.placeBetButton.click();
    this.betPlaced = true;
    return { message: "Back bet placed successfully", odd, stakeVal, profit };
  }
  async placeCricketLayBet(stake) {
    const marketState = await this.isMarketAvailable();
    if (marketState !== "Open") {
      this.betPlaced = false;
      return { message: `Lay bet not placed. Market is ${marketState}` };
    }
    await this.cricketLayOddButton.click();
    await this.stakeInput.fill('');
    await this.stakeInput.type(stake.toString());
    const odd = await this.getOddValue();
    const stakeVal = parseFloat(stake);
    const liability = (odd - 1) * stakeVal;
    if (await this.errorMessage.isVisible()) {
      const msg = (await this.errorMessage.textContent())?.trim();
      this.betPlaced = false;
      return { message: `Lay bet not placed: ${msg}` };
    }
    await expect(this.placeBetButton).toBeEnabled({ timeout: 5000 });
    await this.placeBetButton.click();
    this.betPlaced = true;
    return { message: "Lay bet placed successfully", odd, stakeVal, liability };
  }

  // ✅ Unmatched back bet
  async placeUnmatchedCricketBackBet(stake, backodd) {
    const marketState = await this.isMarketAvailable();
    if (marketState !== "Open") {
      this.betPlaced = false;
      return { message: `Unmatched Back bet not placed. Market is ${marketState}` };
    }
    await this.cricketBackOddButton.click();
    await this.odd.fill('');
    await this.odd.type(backodd.toString());
    await this.stakeInput.fill('');
    await this.stakeInput.type(stake.toString());
    const stakeVal = parseFloat(stake);
    const profit = (backodd - 1) * stakeVal;
    if (await this.errorMessage.isVisible()) {
      const msg = (await this.errorMessage.textContent())?.trim();
      this.betPlaced = false;
      return { message: `Unmatched Back bet not placed: ${msg}` };
    }
    await expect(this.placeBetButton).toBeEnabled({ timeout: 5000 });
    await this.placeBetButton.click();

    this.betPlaced = true;
    return { message: "Unmatched Back bet placed successfully", backodd, stakeVal, profit };
  }
  async placeUnmatchedCricketLayBet(stake, layodd) {
    const marketState = await this.isMarketAvailable();
    if (marketState !== "Open") {
      this.betPlaced = false;
      return { message: `Unmatched Lay bet not placed. Market is ${marketState}` };
    }

    await this.cricketLayOddButton.click();
    await this.odd2.fill('');
    await this.odd2.type(layodd.toString());
    await this.stakeInput.fill('');
    await this.stakeInput.type(stake.toString());

    const stakeVal = parseFloat(stake);
    const liability = (layodd - 1) * stakeVal;

    if (await this.errorMessage.isVisible()) {
      const msg = (await this.errorMessage.textContent())?.trim();
      this.betPlaced = false;
      return { message: `Unmatched Lay bet not placed: ${msg}` };
    }
    await expect(this.placeBetButton).toBeEnabled({ timeout: 5000 });
    await this.placeBetButton.click();
    this.betPlaced = true;
    return { message: "Unmatched Lay bet placed successfully", layodd, stakeVal, liability };
  }
  async getBalanceNumber() {
    const text = await this.balance.first().textContent();
    if (!text) return null;
    const match = text.match(/-?\d[\d,]*\.?\d*/);
    return match ? parseFloat(match[0].replace(/,/g, '')) : null;
  }

  async getExposureText() {
    const text = await this.exposure.first().textContent();
    if (!text) return null;
    const match = text.match(/[+-]?\d[\d,]*\.?\d*/);
    return match ? parseFloat(match[0].replace(/,/g, '')) : null;
  }
  async getAvailableBalanceText() {
    const text = await this.avltobetBalance.first().textContent();
    if (!text) return null;
    const match = text.match(/[+-]?\d[\d,]*\.?\d*/);
    return match ? parseFloat(match[0].replace(/,/g, '')) : null;
  }
  async waitForToastMessage() {
    try {
      await this.toastMessage.first().waitFor({ state: 'visible', timeout: 5000 });
      return (await this.toastMessage.first().textContent())?.trim();
    } catch {
      return null;
    }
  }
  async getOddValue() {
    await this.odd.first().waitFor({ state: 'visible', timeout: 5000 });
    const oddText = await this.odd.inputValue().catch(async () => {
      return await this.odd.textContent();
    });
    return parseFloat(oddText.trim());
  }
};

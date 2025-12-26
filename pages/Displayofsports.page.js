

const { expect } = require('@playwright/test');

exports.DisplaysportsPage = class DisplaysportsPage {
  constructor(page) {
    this.page = page;
    this.soccer = page.locator("//a[@class='nav-link'][normalize-space()='Soccer']");
    this.tennis = page.locator("//a[@class='nav-link'][normalize-space()='Tennis']");
    this.horse = page.locator("//a[normalize-space()='Horse Racing']");
    this.cricket = page.locator("//a[@class='nav-link'][normalize-space()='Cricket']");
    this.basketball = page.locator("//a[normalize-space()='Basketball']");
    this.greyhound = page.locator("//a[normalize-space()='Greyhound Racing']");
    this.home = page.locator("//a[normalize-space()='Home']");
    this.inplay = page.locator("//a[contains(text(),'In-Play')]");
    this.firstEvent = page.locator("body > app-root:nth-child(1) > app-pages:nth-child(3) > div:nth-child(1) > div:nth-child(2) > app-main:nth-child(2) > mat-drawer-container:nth-child(2) > mat-drawer-content:nth-child(4) > app-content:nth-child(2) > app-in-play:nth-child(2) > mat-tab-nav-panel:nth-child(2) > app-in-play-markets:nth-child(2) > app-ip-market-item:nth-child(2) > div:nth-child(3) > table:nth-child(1) > tbody:nth-child(2) > tr:nth-child(1) > td:nth-child(1) > a:nth-child(1) > span:nth-child(2) > span:nth-child(1)"); // ✅ dynamic first event
    this.wiseSoccer = page.locator("//a[@class='nav-item'][normalize-space()='Soccer']");
    this.wiseTennis = page.locator("//a[@class='nav-item'][normalize-space()='Tennis']");
    this.wiseCricket = page.locator("//a[@class='nav-item'][normalize-space()='Cricket']");
  }
  
  async navigateToCricket() {
    await this.cricket.click();
    await this.home.click();
  }
  async navigateToSoccer() {
    await this.soccer.click();
    await this.home.click();
  }
  async navigateToTennis() {
    await this.tennis.click();
    await this.home.click();
  }
  async navigateToHorseRacing() {
    await this.horse.click();
    await this.home.click();
  }
  async navigateToBasketball() {
    await this.basketball.click();
    await this.home.click();
  }

  async navigateToGreyhoundRacing() {
    await this.greyhound.click();
    await this.home.click();
  }

  async navigateToInplay() {
    await this.inplay.click();
  }
  async openFirstEvent() {
    await this.firstEvent.click();
  }
  async navigateToWiseSoccer() {
    await this.wiseSoccer.click();
  }

  async navigateToWiseTennis() {
    await this.wiseTennis.click();
  }

  async navigateToWiseCricket() {
    await this.wiseCricket.click();
  }
};

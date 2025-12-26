exports.DemoLoginPage = class DemoLoginPage {
  constructor(page) {
    this.page = page;
    this.demoLoginBtn = page.locator("//button[@id='demo-btn']");
  }

  async login() {
    await this.demoLoginBtn.click();
  }
};

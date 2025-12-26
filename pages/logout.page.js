exports.LogoutPage = class LogoutPage {
  constructor(page) {
    this.page = page;
    this.profileMenu = page.locator('button[title="User"]');
    this.logoutBtn = page.locator('a:has-text("Log out")');
  }

  async logout() {
    await this.profileMenu.click();
    await this.logoutBtn.click();
  }
};

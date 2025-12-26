exports.LoginPage = class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameField = page.locator("#username");
    this.passwordField = page.locator("#password");
    this.loginBtn = page.locator("#submitButton");
  }

  async login(username, password) {
    await this.usernameField.fill(username);
    await this.passwordField.fill(password);
    await this.loginBtn.click();
  }
};

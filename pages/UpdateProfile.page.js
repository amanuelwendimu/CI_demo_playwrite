const { expect } = require('@playwright/test');

exports.UpdateprofilePage = class UpdateprofilePage {
  constructor(page) {
    this.page = page;

    // STORE LOCATORS ONLY (NO ACTIONS HERE)
    this.menu = page.getByRole('button').filter({ hasText: /^$/ });
    this.myAccount = page.getByRole('menuitem', { name: 'My Account' });

    this.editBtn = page.getByRole('button', { name: 'Edit' });

    this.emailTextbox = page.getByRole('textbox', { name: 'Email' });
    this.dobTextbox = page.getByRole('textbox', { name: 'Select date of birth' });

    this.contactTextbox = page.locator('#mat-input-3');

    this.countryDropdown = page.locator('#mat-select-value-0');
    this.countryOption = page.getByRole('option', { name: 'Ethiopia' });

    this.saveBtn = page.getByRole('button', { name: 'Save' });

   
  }

  async navigateToProfile() {
    await this.menu.click();
    await this.myAccount.click();
  }

  async Updateprofiel() {
    await this.editBtn.click();

    await this.emailTextbox.fill("garamu@123");

    await this.dobTextbox.click();
    await this.dobTextbox.fill("01/03/1992"); // Example date

    await this.contactTextbox.fill("923242562");

    await this.countryDropdown.click();
    await this.countryOption.click();

    await this.saveBtn.click();

    
  }
};

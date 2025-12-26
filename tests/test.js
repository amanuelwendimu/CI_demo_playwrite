import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
 
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.getByRole('button').filter({ hasText: /^$/ }).click();
  await page.getByRole('menuitem', { name: 'My Account' }).click();
  await page.getByRole('button', { name: 'Edit' }).click();
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('garamu@123');
  await page.getByRole('textbox', { name: 'Select date of birth' }).click();
  await page.getByRole('textbox', { name: 'Select date of birth' }).fill('1/3/1992');
  await page.locator('#mat-input-3').click();
  await page.locator('#mat-input-3').fill('923242562');
  await page.locator('#mat-select-value-0').click();
  await page.getByRole('option', { name: 'Ethiopia' }).click();
  await page.getByRole('button', { name: 'Save' }).click();
});
import { test, expect } from '@playwright/test';

async function login(page) {
  await page.goto(`${process.env.BASE_URL}/aam`, { waitUntil: 'networkidle' });
  await page.fill('#userID', process.env.AAM_USERNAME);
  await page.fill('#password', process.env.AAM_PASSWORD);
  const loginButton = page.getByRole('button', { name: 'Login' });
  await expect(loginButton).toBeEnabled({ timeout: 10000 });
  await loginButton.click();
  const alreadyLoggedInText = page.getByText(/You are already logged in,/i);
  try {
    await expect(alreadyLoggedInText).toBeVisible({ timeout: 3000 });
    await page.getByRole('button', { name: 'OK' }).click();
  } catch (error) {
    console.log('No popup appeared or other error: ', error.message);
  }
  await page.waitForURL('**/service', { timeout: 7000 });
}

test('Creating the beneficiary', async ({ page }) => {
  await login(page);
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.pause();
  await page.getByRole('button', { name: 'Registration' }).click();
  await page.getByRole('button', { name: 'Registration' }).nth(1).click();
  await page.getByRole('button', { name: 'ACCEPT' }).click();
  await page.fill('#mat-input-2', 'Rahul');
  await page.fill('#mat-input-3', '25');
  await page.locator('div.mat-mdc-select-trigger').nth(0).click();
  await page.locator('mat-option span.mdc-list-item__primary-text', { hasText: 'Male' }).click();
  await page.locator('mat-select[formcontrolname="ageUnit"]').click();
  await page.locator('mat-option span.mdc-list-item__primary-text', { hasText: 'Years' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
});



import { test, expect } from '@playwright/test';
import dotenv from 'dotenv'
dotenv.config();

test('Login with invalid credentials shows error', async ({ page }) => {
  await page.goto(`${process.env.BASE_URL}/aam`, { waitUntil: 'domcontentloaded' });
  await page.locator('#userID').click();
  await page.locator('#userID').fill('wronguser');

  await page.locator('#password').click();
  await page.locator('#password').fill('wrongpass');

  const loginButton = page.getByRole('button', { name: 'Login' });
  await expect(loginButton).toBeEnabled({ timeout: 10000 });
  await loginButton.click();

  await expect(page.getByText(/User login failed due to/i)).toBeVisible({ timeout: 5000 });
});

test('Login with valid credentials shows already logged in message', async ({ page }) => {
  await page.goto(`${process.env.BASE_URL}/aam`, { waitUntil: 'domcontentloaded' });
  await page.locator('#userID').click();
  await page.locator('#userID').fill(`${process.env.AAM_USERNAME}`);

  await page.locator('#password').click();
  await page.locator('#password').fill(`${process.env.AAM_PASSWORD}`);  

  const loginButton = page.getByRole('button', { name: 'Login' });
  await expect(loginButton).toBeEnabled({ timeout: 10000 });
  await loginButton.click();
  const alreadyLoggedInText = page.getByText(/You are already logged in,/i);
  const isPopupVisible = await alreadyLoggedInText.isVisible({ timeout: 3000 }).catch(() => false);

  if (isPopupVisible) {
    await page.getByRole('button', { name: 'OK' }).click();
  }

  await page.waitForURL('**/service', { timeout: 7000 });
  await expect(page).toHaveURL(/\/service$/);

  await page.locator('a').filter({ hasText: 'power_settings_new' }).click();
});


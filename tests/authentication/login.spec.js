import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();

const requiredVars = ['BASE_URL', 'VALID_USERNAME', 'VALID_PASSWORD'];
for (const v of requiredVars) {
  if (!process.env[v]) {
    throw new Error(`Missing required environment variable: ${v}`);
  }
}

test('Login with invalid credentials shows error', async ({ page }) => {
  await page.goto(`${process.env.BASE_URL}/#/login`, { waitUntil: 'domcontentloaded' });

  if (process.env.PLAYWRIGHT_DEBUG === 'true') {
    await page.pause();
  }

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
  await page.goto(`${process.env.BASE_URL}/#/login`, { waitUntil: 'domcontentloaded' });

  if (process.env.PLAYWRIGHT_DEBUG === 'true') {
    await page.pause();
  }

  await page.locator('#userID').click();
  await page.locator('#userID').fill(`${process.env.VALID_USERNAME}`);

  await page.locator('#password').click();
  await page.locator('#password').fill(`${process.env.VALID_PASSWORD}`);

  const loginButton = page.getByRole('button', { name: 'Login' });
  await expect(loginButton).toBeEnabled({ timeout: 10000 });
  await loginButton.click();

  await expect(page.getByText(/You are already logged in,/i)).toBeVisible({ timeout: 5000 });
  await page.getByRole('button', { name: 'OK' }).click();

  await page.locator('a').filter({ hasText: 'power_settings_new' }).click();
});

test('Fresh login should redirect to dashboard without already logged in message', async ({ page }) => {
  await page.goto(`${process.env.BASE_URL}/#/login`, { waitUntil: 'domcontentloaded' });

  if (process.env.PLAYWRIGHT_DEBUG === 'true') {
    await page.pause();
  }

  await page.locator('#userID').fill(process.env.VALID_USERNAME);
  await page.locator('#password').fill(process.env.VALID_PASSWORD);

  const loginButton = page.getByRole('button', { name: 'Login' });
  await loginButton.click();

  await expect(
    page.getByText(/You are already logged in,/i)
  ).not.toBeVisible({ timeout: 3000 });

  await page.waitForURL('**/service', { timeout: 7000 });
});

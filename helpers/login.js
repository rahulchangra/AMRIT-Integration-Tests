import { expect } from '@playwright/test';

export async function login(page) {
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

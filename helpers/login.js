import { expect } from '@playwright/test';

export async function login(page) {
  const { BASE_URL, AAM_USERNAME, AAM_PASSWORD } = process.env;
  if (!BASE_URL || !AAM_USERNAME || !AAM_PASSWORD) {
    throw new Error('Missing required env vars: BASE_URL, AAM_USERNAME, AAM_PASSWORD');
  }

  await page.goto(`${BASE_URL}/aam`, { waitUntil: 'networkidle' });
  await page.fill('#use rID', AAM_USERNAME);
  await page.fill('#password', AAM_PASSWORD);

  const loginButton = page.getByRole('button', { name: 'Login' });
  await expect(loginButton).toBeEnabled({ timeout: 10000 });
  await loginButton.click();

  const alreadyLoggedInText = page.getByText(/You are already logged in/i);
  try {
    await expect(alreadyLoggedInText).toBeVisible({ timeout: 3000 });
    await page.getByRole('dialog').getByRole('button', { name: /^OK$/i }).click();
  } catch (error) {
    console.log('No popup appeared or other error: ', error.message);
  }

  await page.waitForURL('**/service', { timeout: 7000 });
}

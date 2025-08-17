import { expect } from '@playwright/test';

export async function login(page) {
  // ✅ Destructure env vars
  const { BASE_URL, AAM_USERNAME, AAM_PASSWORD } = process.env;

  // ✅ Fail fast if missing
  if (!BASE_URL || !AAM_USERNAME || !AAM_PASSWORD) {
    throw new Error('Missing required env vars: BASE_URL, AAM_USERNAME, AAM_PASSWORD');
  }

  // Navigate
  await page.goto(`${BASE_URL}/aam`, { waitUntil: 'networkidle' });

  // Fill credentials
  await page.fill('#userID', AAM_USERNAME);
  await page.fill('#password', AAM_PASSWORD);

  // Ensure login button is enabled
  const loginButton = page.getByRole('button', { name: 'Login' });
  await expect(loginButton).toBeEnabled({ timeout: 10000 });
  await loginButton.click();

  // ✅ Loosen text match (ignore comma, case)
  const alreadyLoggedInText = page.getByText(/You are already logged in/i);

  try {
    // Wait for popup if it appears
    await expect(alreadyLoggedInText).toBeVisible({ timeout: 3000 });

    // ✅ Scope to dialog, make button match stricter
    await page.getByRole('dialog').getByRole('button', { name: /^OK$/i }).click();

  } catch (err) {
    // Only ignore timeout errors (popup not appearing)
    if (err.name !== 'TimeoutError') {
      throw err; // rethrow unexpected errors
    }
    console.log('No popup appeared (normal case).');
  }

  // Wait for navigation
  await page.waitForURL('**/service', { timeout: 7000 });
}

import { test, expect } from '@playwright/test';
import { login } from '../../../helpers/login.js';

test('Login with invalid credentials shows error', async ({ page }) => {
  await page.goto(`${process.env.BASE_URL}/aam`, { waitUntil: 'networkidle' });
  await page.fill('#userID', 'wronguser');
  await page.fill('#password', 'wrongpass');
  const loginButton = page.getByRole('button', { name: 'Login' });
  await expect(loginButton).toBeEnabled({ timeout: 10000 });
  await loginButton.click();
  await expect(page.getByText(/Invalid username or password/i)).toBeVisible({ timeout: 5000 });
});

test('Login with valid credentials navigates to service', async ({ page }) => {
   await login(page);
   await expect(page).toHaveURL(/\/service$/);
});





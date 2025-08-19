import { test, expect } from '@playwright/test';
import { login } from '../../../helpers/login.js';


test('Creating the beneficiary', async ({ page }) => {
  await login(page);
  await page.getByRole('button', { name: 'Continue' }).click();
});
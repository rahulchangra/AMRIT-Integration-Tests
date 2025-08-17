import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { login } from '../../../helpers/login.js';


test('Creating the beneficiary', async ({ page }) => {
  await login(page);
  await page.getByRole('button', { name: 'Continue' }).click();
});
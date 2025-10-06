import { test, expect } from '@playwright/test';
import { login } from '../../../helpers/login.js';
import { fileURLToPath } from 'url';
import * as path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import * as fs from 'fs';

test('Nurse provides consultation to the beneficiary', async ({ page }) => {
    await login(page);
    await page.getByRole('button', { name: 'Continue' }).click();

        const filePath = path.resolve(__dirname, '../../../beneficiary.json');
    const beneficiaryId = JSON.parse(fs.readFileSync(filePath, 'utf-8')).beneficiaryId;

    expect(beneficiaryId).toBeTruthy();

    await page.getByRole('searchbox', { name: 'In-Table Search' }).fill(beneficiaryId);
    await page.getByRole('button', { name: 'search' }).click();

    await expect(page.locator('table')).toBeVisible();
    await expect(page.getByRole('cell', { name: String(beneficiaryId) })).toBeVisible();
    await page.getByRole('cell', { name: String(beneficiaryId) }).click();

    const okButton = page.getByRole('button', { name: 'OK' });
    await expect(okButton).toBeVisible();
    await expect(okButton).toBeEnabled();
    await okButton.click();
    });
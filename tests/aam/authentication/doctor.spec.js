import { test, expect } from '@playwright/test';
import { login } from '../../../helpers/login.js';
import { fileURLToPath } from 'url';
import * as path from 'path';
import * as fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const testRequestPath = path.resolve(__dirname, '../../../testRequest.json');
const beneficiaryPath = path.resolve(__dirname, '../../../beneficiary.json');

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, 'utf-8'));
}
function writeJson(p, obj) {
  fs.writeFileSync(p, JSON.stringify(obj, null, 2));
}

test('Doctor completes consultation and creates lab test request', async ({ page }) => {
  await login(page);
  await page.getByRole('button', { name: 'Continue' }).click();

  const beneficiaryId = readJson(beneficiaryPath).beneficiaryId;
  expect(beneficiaryId).toBeTruthy();

  await page.getByRole('button', { name: 'Doctor' }).click();
  await page.getByRole('searchbox', { name: 'In-Table Search' }).fill(beneficiaryId);
  await page.getByRole('button', { name: 'search' }).click();
  await expect(page.locator('table')).toBeVisible();
  await page.getByRole('cell', { name: String(beneficiaryId) }).click();

  const okButton = page.getByRole('button', { name: 'OK' });
  await expect(okButton).toBeEnabled();
  await okButton.click();

  await page.getByRole('tabpanel', { name: 'Visit Details' }).getByRole('button', { name: 'Next' }).click();
  await page.getByRole('textbox', { name: 'Clinical Observations' }).fill('Patient complaints of high Fever for 4-5 days. Body Temperature is 103 degree F. No cough or sore throat.');

  await page.locator('.mat-mdc-select-placeholder').first().click();
  await page.getByRole('option', { name: 'Hemoglobin' }).locator('mat-pseudo-checkbox').click();
  await page.keyboard.press('Escape');

  await page.locator('div').filter({ hasText: /^Provisional Diagnosis$/ }).nth(3).click();
  await page.getByRole('combobox', { name: 'Provisional Diagnosis' }).pressSequentially('Fever');
  await page.waitForSelector('[role="option"]', { state: 'visible' });
  const feverOption = page.getByRole('option', { name: 'Fever', exact: true }).first();
  await expect(feverOption).toBeVisible();
  await feverOption.click();
  await page.getByRole('button', { name: 'Add' }).nth(1).click();

  await page.locator('.mat-mdc-select-placeholder.mat-mdc-select-min-line.ng-tns-c3393473648-42').click();
  await page.getByRole('option', { name: 'Tablet' }).click();
  await page.getByRole('combobox', { name: 'Medicine' }).click();
  await page.getByRole('combobox', { name: 'Medicine' }).fill('par');
  await page.getByText('Paracetamol 500mg').click();
  await page.getByRole('button', { name: 'OK' }).click();
  await page.locator('.mat-mdc-select-placeholder.mat-mdc-select-min-line.ng-tns-c3393473648-46').click();
  await page.getByText('Half Tab', { exact: true }).click();
  await page.locator('.mat-mdc-select-placeholder.mat-mdc-select-min-line.ng-tns-c3393473648-48').click();
  await page.getByText('Single Dose After Food').click();
  await page.locator('.mat-mdc-select-placeholder.mat-mdc-select-min-line.ng-tns-c3393473648-50').click();
  await page.getByRole('option', { name: '5', exact: true }).click();
  await page.locator('.mat-mdc-select-placeholder.mat-mdc-select-min-line.ng-tns-c3393473648-52').click();
  await page.locator('#mat-option-104').getByText('Day(s)').click();
  await page.locator('#add-button').click();

  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await page.locator('.mat-mdc-select-placeholder.mat-mdc-select-min-line.ng-tns-c3393473648-71').click();
  await page.getByText('PHC').click();
  await page.locator('#mat-input-38').fill('Revisit');
  await page.getByRole('textbox', { name: 'Revisit Date' }).click();
  await page.getByRole('button', { name: 'Open calendar' }).click();
  await page.getByRole('button', { name: 'November 18,' }).click();
  await page.getByRole('button', { name: 'Submit' }).click();
  await page.getByRole('button', { name: 'OK' }).click();
  await page.getByRole('button', { name: 'No' }).click();

  writeJson(testRequestPath, { beneficiaryId, testName: 'Hemoglobin', resultStatus: 'Pending' });
});
import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';


async function login(page) {
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

test('Creating the beneficiary', async ({ page }) => {
  await login(page);
  await page.getByRole('button', { name: 'Continue' }).click();
  await expect(page.getByRole('button', { name: 'Registration' })).toBeVisible();
  await page.getByRole('button', { name: 'Registration' }).click();
  await page.getByRole('button', { name: 'Registration' }).nth(1).click();
  await page.getByRole('button', { name: 'ACCEPT' }).click();
  await expect(page.getByRole('textbox', { name: /First Name/i })).toBeVisible();
  await page.fill('#mat-input-2', faker.person.firstName());
  await page.fill('#mat-input-3', '25');
  await page.getByRole('combobox', { name: 'Gender' }).locator('span').click();
  await page.getByText('Male', { exact: true }).click();
  await page.getByRole('combobox', { name: 'Age Unit' }).locator('span').click();
  await page.getByRole('option', { name: 'Years' }).click();
  await page.getByRole('button', { name: 'Open calendar' }).click();
  await page.getByRole('button', { name: 'Choose month and year' }).click();
  await page.getByRole('button', { name: '2000' }).click();
  await page.getByRole('button', { name: 'September' }).click();
  await page.getByRole('button', { name: 'September 1,' }).click();
  await page.getByRole('combobox', { name: 'Marital Status' }).locator('span').click();
  await page.getByRole('option', { name: 'Unmarried' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('combobox', { name: 'State Assam' }).locator('svg').click();
  await page.getByRole('option', { name: 'Assam', exact: true }).click();
  await page.getByRole('combobox', { name: 'District Baksa' }).locator('svg').click();
  await page.getByRole('option', { name: 'Baksa' }).click();
  await page.getByRole('combobox', { name: 'Taluk/Tehsil Barama Pt' }).locator('svg').click();
  await page.getByRole('option', { name: 'Barama Pt', exact: true }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('textbox', { name: 'Father Name' }).click();
  await page.getByRole('textbox', { name: 'Father Name' }).fill(faker.person.firstName());
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByRole('heading', { name: 'Success' })).toBeVisible({ timeout: 10000 });
  await page.getByRole('button', { name: 'OK' }).click();
});


test('Submit button is disabled when required details are missing', async ({ page }) => {
  await login(page);
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByRole('button', { name: 'Registration' }).click();
  await page.getByRole('button', { name: 'Registration' }).nth(1).click();
  await page.getByRole('button', { name: 'ACCEPT' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('combobox', { name: 'State Assam' }).locator('svg').click();
  await page.getByRole('option', { name: 'Assam', exact: true }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('textbox', { name: 'Father Name' }).click();
  await page.getByRole('textbox', { name: 'Father Name' }).fill(faker.person.firstName());
  await page.getByRole('button', { name: 'Next' }).click();
  await expect(page.getByRole('button', { name: 'Submit' })).toBeDisabled();
});

import { expect, Locator, Page, test } from '@playwright/test';

const TOGGLE_CYCLES = 3;

const getCheckbox = (page: Page, index: number) => page.getByRole('checkbox').nth(index);

const toggleCheckbox = async (checkbox: Locator) => {
  await checkbox.check();
  await expect(checkbox).toBeChecked();

  await checkbox.uncheck();
  await expect(checkbox).not.toBeChecked();
};

test.describe('Checkbox page tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/checkboxes');
  });

  test('displays expected labels on the Checkboxes page', async ({ page }) => {
    const expectedTexts = [
      'Checkboxes',
      'checkbox 1',
      'checkbox 2',
      'Powered by Elemental Selenium',
    ];

    for (const text of expectedTexts) {
      await expect(page.getByText(text, { exact: false })).toBeVisible();
    }
  });

  test('renders visible checkbox inputs with correct type', async ({ page }) => {
    const checkboxes = page.getByRole('checkbox');
    const count = await checkboxes.count();

    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const checkbox = checkboxes.nth(i);
      await expect(checkbox).toBeVisible();
      await expect(checkbox).toHaveAttribute('type', 'checkbox');
    }
  });

  test('has default states: first unchecked, second checked', async ({ page }) => {
    await expect(getCheckbox(page, 0)).not.toBeChecked();
    await expect(getCheckbox(page, 1)).toBeChecked();
  });

  test('checks the first checkbox', async ({ page }) => {
    const first = getCheckbox(page, 0);
    await first.check();
    await expect(first).toBeChecked();
  });

  test('toggles the second checkbox on and then off', async ({ page }) => {
    const second = getCheckbox(page, 1);
    await second.check();
    await expect(second).toBeChecked();
    await second.uncheck();
    await expect(second).not.toBeChecked();
  });

  test('repeatedly toggles the first checkbox', async ({ page }) => {
    const checkbox = getCheckbox(page, 0);
    for (let i = 0; i < TOGGLE_CYCLES; i++) {
      await toggleCheckbox(checkbox);
    }
  });

  test('repeatedly toggles the second checkbox', async ({ page }) => {
    const checkbox = getCheckbox(page, 1);

    if (await checkbox.isChecked()) {
      await checkbox.uncheck();
      await expect(checkbox).not.toBeChecked();
    }

    for (let i = 0; i < TOGGLE_CYCLES; i++) {
      await toggleCheckbox(checkbox);
    }
  });

  test('does not find a nonexistent checkbox', async ({ page }) => {
    await expect(page.locator('#nonexistent-checkbox')).toHaveCount(0);
  });

  test('opens Elemental Selenium in a new tab', async ({ page }) => {
    const [newPage] = await Promise.all([
      page.waitForEvent('popup'),
      page.getByRole('link', { name: 'Elemental Selenium' }).click(),
    ]);

    await newPage.waitForLoadState();

    expect(newPage.url()).toContain('https://elementalselenium.com/');
  });

  test('shows GitHub ribbon and navigates to repository on click', async ({ page }) => {
    await expect(page.getByRole('img', { name: 'Fork me on GitHub' })).toBeVisible();
    await page.getByRole('img', { name: 'Fork me on GitHub' }).click();
    await expect(page).toHaveURL('https://github.com/saucelabs/the-internet');
  });
});

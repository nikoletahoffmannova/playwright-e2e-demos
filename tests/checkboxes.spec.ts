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

  test('page has expected text', async ({ page }) => {
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

  test('count and attributes of checkboxes', async ({ page }) => {
    const checkboxes = page.getByRole('checkbox');
    const count = await checkboxes.count();

    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const checkbox = checkboxes.nth(i);
      await expect(checkbox).toBeVisible();
      await expect(checkbox).toHaveAttribute('type', 'checkbox');
    }
  });

  test('default checked state', async ({ page }) => {
    await expect(getCheckbox(page, 0)).not.toBeChecked();
    await expect(getCheckbox(page, 1)).toBeChecked();
  });

  test('first checkbox can be checked', async ({ page }) => {
    const first = getCheckbox(page, 0);
    await first.check();
    await expect(first).toBeChecked();
  });

  test('second checkbox can be unchecked and re-checked', async ({ page }) => {
    const second = getCheckbox(page, 1);
    await second.check();
    await expect(second).toBeChecked();
    await second.uncheck();
  });

  test('toggle scenario for first checkbox', async ({ page }) => {
    const checkbox = getCheckbox(page, 0);
    for (let i = 0; i < TOGGLE_CYCLES; i++) {
      await toggleCheckbox(checkbox);
    }
  });

  test('toggle scenario for second checkbox', async ({ page }) => {
    const checkbox = getCheckbox(page, 1);

    if (await checkbox.isChecked()) {
      await checkbox.uncheck();
      await expect(checkbox).not.toBeChecked();
    }

    for (let i = 0; i < TOGGLE_CYCLES; i++) {
      await toggleCheckbox(checkbox);
    }
  });

  test('nonexistent checkbox is not found', async ({ page }) => {
    await expect(page.locator('#nonexistent-checkbox')).toHaveCount(0);
  });

  test('Powered by Selenium link visibility', async ({ page }) => {
    const [newPage] = await Promise.all([
      page.waitForEvent('popup'),
      page.getByRole('link', { name: 'Elemental Selenium' }).click(),
    ]);

    await newPage.waitForLoadState();

    expect(newPage.url()).toContain('https://elementalselenium.com/');
  });

  test('Fork me on GitHub image visibility', async ({ page }) => {
    await expect(page.getByRole('img', { name: 'Fork me on GitHub' })).toBeVisible();
  });
});

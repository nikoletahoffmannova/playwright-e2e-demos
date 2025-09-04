import { expect, Page, test } from '@playwright/test';

const firstColumn = (page: Page) => page.locator('#column-a');
const secondColumn = (page: Page) => page.locator('#column-b');
const columnByIndex = (page: Page, index: number) => page.locator('#columns > div').nth(index);
const allColumns = (page: Page) => page.locator('#columns > div');

const DRAG_TOGGLE_CYCLES = 3;

const toggleColumns = async (page: Page) => {
  await firstColumn(page).dragTo(secondColumn(page));
  await secondColumn(page).dragTo(firstColumn(page));
};

test.describe('Drag & Drop tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/drag_and_drop');
  });

  test('page has expected texts and attributes', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Drag and Drop' })).toBeVisible();
    await expect(firstColumn(page)).toBeVisible();
    await expect(secondColumn(page)).toBeVisible();
    await expect(page.getByRole('link', { name: 'Elemental Selenium' })).toBeVisible();
    await expect(page.getByRole('img', { name: 'Fork me on GitHub' })).toBeVisible();
  });

  test('check default state', async ({ page }) => {
    await expect(columnByIndex(page, 0)).toHaveText('A');
    await expect(columnByIndex(page, 1)).toHaveText('B');
  });

  test('first column can be dragged', async ({ page }) => {
    await expect(firstColumn(page)).toContainText('A');
    await expect(secondColumn(page)).toContainText('B');

    await firstColumn(page).dragTo(secondColumn(page));

    await expect(firstColumn(page)).toContainText('B');
    await expect(secondColumn(page)).toContainText('A');

    await expect(allColumns(page).nth(0)).toHaveText('B');
    await expect(allColumns(page).nth(1)).toHaveText('A');
  });

  test('second column can be dragged', async ({ page }) => {
    await expect(firstColumn(page)).toContainText('A');
    await expect(secondColumn(page)).toContainText('B');

    await secondColumn(page).dragTo(firstColumn(page));

    await expect(firstColumn(page)).toContainText('B');
    await expect(secondColumn(page)).toContainText('A');
  });

  test('columns can be toggled multiple times', async ({ page }) => {
    await expect(firstColumn(page)).toContainText('A');
    await expect(secondColumn(page)).toContainText('B');

    for (let i = 0; i < DRAG_TOGGLE_CYCLES; i++) {
      await toggleColumns(page);
    }
  });
});

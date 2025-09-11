import { expect, Page, test } from '@playwright/test';

const firstColumn = (page: Page) => page.locator('#column-a');
const secondColumn = (page: Page) => page.locator('#column-b');
const columnByIndex = (page: Page, index: number) => page.locator('#columns > div').nth(index);
const DRAG_TOGGLE_CYCLES = 3;

const toggleColumns = async (page: Page) => {
  await firstColumn(page).dragTo(secondColumn(page));
  await secondColumn(page).dragTo(firstColumn(page));
};

const expectColumnsState = async (page: Page, expected: string[]) => {
  for (let i = 0; i < expected.length; i++) {
    await expect(columnByIndex(page, i)).toHaveText(expected[i]);
  }
};

test.describe('Drag & Drop tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/drag_and_drop');
  });

  test('shows drag-and-drop header and both columns', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Drag and Drop' })).toBeVisible();
    await expect(firstColumn(page)).toBeVisible();
    await expect(secondColumn(page)).toBeVisible();
  });

  test('shows footer links', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'Elemental Selenium' })).toBeVisible();
    await expect(page.getByRole('img', { name: 'Fork me on GitHub' })).toBeVisible();
  });

  test('defaults to A then B', async ({ page }) => {
    await expectColumnsState(page, ['A', 'B']);
  });

  test('dragging first onto second swaps to B,A', async ({ page, browserName }) => {
    if (browserName === 'webkit') test.slow();
    await expect(firstColumn(page)).toContainText('A');
    await expect(secondColumn(page)).toContainText('B');

    await firstColumn(page).dragTo(secondColumn(page));

    await expectColumnsState(page, ['B', 'A']);
  });

  test('dragging second onto first swaps to B,A', async ({ page }) => {
    await expectColumnsState(page, ['A', 'B']);

    await secondColumn(page).dragTo(firstColumn(page));

    await expectColumnsState(page, ['B', 'A']);
  });

  test('toggling columns multiple times returns to A,B each cycle', async ({ page }) => {
    await expectColumnsState(page, ['A', 'B']);

    for (let i = 0; i < DRAG_TOGGLE_CYCLES; i++) {
      await toggleColumns(page);
      await expectColumnsState(page, ['A', 'B']);
    }
  });

  test('dragging onto itself keeps A,B', async ({ page }) => {
    await expectColumnsState(page, ['A', 'B']);

    await firstColumn(page).dragTo(firstColumn(page));
    await secondColumn(page).dragTo(secondColumn(page));

    await expectColumnsState(page, ['A', 'B']);
  });
});

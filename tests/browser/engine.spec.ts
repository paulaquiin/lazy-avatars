import { expect, test } from '@playwright/test';
import { testCollection } from '../../fixtures/test-collection.js';
import { createAvatar } from '../../packages/core/src/index.js';

test('browser and Node produce identical SVG bytes for Unicode, shapes and every theme', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  for (const seed of ['demo-person-01', ' A\u0301na ', '李 明', '<script>&🙂']) {
    await page.getByLabel('Semilla', { exact: true }).fill(seed);
    for (const palette of ['pastel', 'corporate', 'night', 'earth', 'mono'] as const) {
      await page.getByLabel('Tema', { exact: true }).selectOption(palette);
      await page.getByLabel('Forma', { exact: true }).selectOption('circle');
      await expect(page.locator('#output')).toHaveText(
        createAvatar(testCollection, { seed, palette, shape: 'circle' }),
      );
    }
  }
  expect(errors).toEqual([]);
  await expect(page.locator('#sizes img')).toHaveCount(5);
  expect(
    await page
      .locator('#sizes img')
      .evaluateAll((images) =>
        images.every(
          (image) => image instanceof HTMLImageElement && image.complete && image.naturalWidth > 0,
        ),
      ),
  ).toBe(true);
});

test('rejects blank seeds, recovers and downloads the displayed SVG', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Semilla', { exact: true }).fill('   ');
  await expect(page.getByRole('status')).toContainText('seed must contain');
  await expect(page.locator('#download')).toBeDisabled();
  await page.getByLabel('Semilla', { exact: true }).fill('demo');
  const source = await page.locator('#output').textContent();
  const downloading = page.waitForEvent('download');
  await page.locator('#download').click();
  const download = await downloading;
  const stream = await download.createReadStream();
  const chunks: Buffer[] = [];
  for await (const chunk of stream) chunks.push(Buffer.from(chunk));
  expect(Buffer.concat(chunks).toString('utf8')).toBe(source);
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

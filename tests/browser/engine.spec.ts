import { expect, test } from '@playwright/test';
import { monogram } from '../../packages/core/src/collections/monogram/index.js';
import { mosaic } from '../../packages/core/src/collections/mosaic/index.js';
import { rack, statusColors } from '../../packages/core/src/collections/rack/index.js';
import { siesta } from '../../packages/core/src/collections/siesta/index.js';
import type { Collection } from '../../packages/core/src/index.js';
import { createAvatar } from '../../packages/core/src/index.js';

for (const collection of [mosaic, monogram, rack, siesta] as readonly Collection<object>[]) {
  test(`${collection.id}: browser and Node have identical bytes across themes, shapes and Unicode`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto(`/?collection=${collection.id}`);
    for (const seed of ['Ada Moss', ' A\u0301na ', '李 明', '<script>&🙂']) {
      await page.getByLabel('Semilla', { exact: true }).fill(seed);
      for (const palette of ['pastel', 'corporate', 'night', 'earth', 'mono'] as const) {
        await page.getByLabel('Tema', { exact: true }).selectOption(palette);
        for (const shape of ['square', 'rounded', 'circle'] as const) {
          await page.getByLabel('Forma', { exact: true }).selectOption(shape);
          await expect(page.locator('#output')).toHaveText(
            createAvatar(collection, { seed, palette, shape }),
          );
        }
      }
    }
    expect(errors).toEqual([]);
    await expect(page.locator('#sizes img')).toHaveCount(5);
    await expect
      .poll(() =>
        page
          .locator('#sizes img')
          .evaluateAll((images) =>
            images.every(
              (image) =>
                image instanceof HTMLImageElement && image.complete && image.naturalWidth > 0,
            ),
          ),
      )
      .toBe(true);
  });
}

test('rejects blank seeds, recovers, downloads SVG and fits mobile', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Semilla', { exact: true }).fill('   ');
  await expect(page.locator('#status')).toContainText('seed must contain');
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
  for (const view of ['sizes', 'variety', 'context', 'palettes']) {
    await page.locator(`button[data-view="${view}"]`).click();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
  }
});

test('restores shared URL options, reviews 60 seeds at all sizes, and copies working code', async ({
  page,
  context,
}) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto(
    '/?collection=siesta&seed=Demo%20%26%20safe&view=variety&count=60&contactSize=32&accessory=blanket&body=cloud&theme=night&shape=circle&dark=1&background=0',
  );
  await expect(page.locator('#option-accessory')).toHaveValue('blanket');
  await expect(page.locator('#option-body')).toHaveValue('cloud');
  await expect(page.locator('#sizes img')).toHaveCount(60);
  const original = await page.locator('#output').textContent();
  await page.reload();
  await expect(page.locator('#output')).toHaveText(original ?? '');
  for (const size of ['24', '32', '64', '128']) {
    await page.getByLabel('Tamaño de revisión', { exact: true }).selectOption(size);
    await expect(page.locator('#sizes img').first()).toHaveAttribute('width', size);
  }
  await page.locator('#copy-code').click();
  await expect
    .poll(async () =>
      (await page.evaluate(() => navigator.clipboard.readText())).replace(/\r\n/g, '\n'),
    )
    .toBe(await page.locator('#code').textContent());
  await page.locator('#share').click();
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe(page.url());
  await page.locator('button[data-view="palettes"]').click();
  await expect(page.locator('#sizes img')).toHaveCount(6);
  await page.getByLabel('Colección', { exact: true }).selectOption('rack');
  await page.locator('button[data-view="context"]').click();
  const rows = page.locator('.servers tr');
  await expect(rows).toHaveCount(4);
  for (const [index, status] of (['ok', 'warn', 'down', 'off'] as const).entries()) {
    const src = await rows.nth(index).locator('img').getAttribute('src');
    expect(decodeURIComponent(src?.split(',')[1] ?? '')).toContain(
      `fill="${statusColors[status]}"`,
    );
    await expect(rows.nth(index).locator('td[data-status]')).toHaveAttribute('data-status', status);
  }
});

test('ignores invalid URL enums and makes no external image or font requests', async ({ page }) => {
  const external: string[] = [];
  page.on('request', (request) => {
    if (!request.url().startsWith('http://127.0.0.1:4173/') && !request.url().startsWith('data:'))
      external.push(request.url());
  });
  await page.goto('/?collection=__proto__&theme=constructor&shape=triangle&tile=unknown');
  await expect(page.getByLabel('Colección', { exact: true })).toHaveValue('mosaic');
  await expect(page.getByLabel('Tema', { exact: true })).toHaveValue('auto');
  await expect(page.locator('#sizes img')).toHaveCount(5);
  expect(external).toEqual([]);
});

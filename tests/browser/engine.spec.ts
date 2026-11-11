import { expect, test } from '@playwright/test';
import { constellation } from '../../packages/core/src/collections/constellation/index.js';
import { deco } from '../../packages/core/src/collections/deco/index.js';
import { helmet } from '../../packages/core/src/collections/helmet/index.js';
import { latte } from '../../packages/core/src/collections/latte/index.js';
import { mission } from '../../packages/core/src/collections/mission/index.js';
import { monogram } from '../../packages/core/src/collections/monogram/index.js';
import { mosaic } from '../../packages/core/src/collections/mosaic/index.js';
import { orbit } from '../../packages/core/src/collections/orbit/index.js';
import { origami } from '../../packages/core/src/collections/origami/index.js';
import { pantry } from '../../packages/core/src/collections/pantry/index.js';
import { rack, statusColors } from '../../packages/core/src/collections/rack/index.js';
import { siesta } from '../../packages/core/src/collections/siesta/index.js';
import { tinbot } from '../../packages/core/src/collections/tinbot/index.js';
import type { Collection } from '../../packages/core/src/index.js';
import { createAvatar } from '../../packages/core/src/index.js';

for (const collection of [
  mosaic,
  monogram,
  rack,
  siesta,
  origami,
  pantry,
  deco,
  latte,
  constellation,
  tinbot,
  orbit,
  mission,
  helmet,
] as readonly Collection<object>[]) {
  test(`${collection.id}: browser and Node have identical bytes across themes, shapes and Unicode`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto(`/?collection=${collection.id}`);
    await page.getByLabel('Nombre o texto', { exact: true }).selectOption('__custom');
    for (const seed of ['Ada Moss', ' A\u0301na ', '李 明', '<script>&🙂']) {
      await page.getByLabel('Tu nombre o texto').fill(seed);
      for (const palette of ['pastel', 'corporate', 'night', 'earth', 'mono'] as const) {
        await page.getByLabel('Colores', { exact: true }).selectOption(palette);
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

test('rejects blank seeds, copies one link and fits mobile', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/');
  await page.getByLabel('Nombre o texto', { exact: true }).selectOption('__custom');
  await page.getByLabel('Tu nombre o texto').fill('   ');
  await expect(page.locator('#status')).toHaveText(
    'Escribe un nombre o texto para crear el avatar.',
  );
  await expect(page.locator('#share')).toBeDisabled();
  await page.getByLabel('Tu nombre o texto').fill('demo');
  await expect(page.locator('#status')).toBeEmpty();
  await expect(page.locator('.actions button')).toHaveCount(1);
  await page.locator('#share').click();
  await expect(page.locator('#share')).toHaveText('Enlace copiado');
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe(page.url());
  await page.getByRole('button', { name: 'Sorpréndeme' }).click();
  await expect(page.locator('#seed')).not.toHaveValue('demo');
  await page.locator('button[data-collection="siesta"]').click();
  await expect(page.getByLabel('Colección', { exact: true })).toHaveValue('siesta');
  await page.setViewportSize({ width: 390, height: 844 });
  for (const view of ['sizes', 'variety', 'context', 'palettes']) {
    await page.locator(`button[data-view="${view}"]`).click();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
  }
});

test('limits custom names and truncates the demonstration profile visually', async ({ page }) => {
  const name = 'W'.repeat(40);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`/?seed=${'W'.repeat(60)}&view=context`);
  await expect(page.locator('#seed')).toHaveValue(name);
  await expect(page).toHaveURL(`http://127.0.0.1:4173/?seed=${name}&view=context`);
  const profileName = page.locator('.context-card.profile h3');
  await expect(profileName).toHaveText(name);
  await expect(profileName).toHaveAttribute('title', name);
  expect(
    await profileName.evaluate(
      (element) =>
        getComputedStyle(element).textOverflow === 'ellipsis' &&
        element.scrollWidth > element.clientWidth,
    ),
  ).toBe(true);
  await page.getByLabel('Tu nombre o texto').fill('A'.repeat(60));
  await expect(page.locator('#seed')).toHaveValue('A'.repeat(40));
});

test('keeps the homepage URL clean and shares only changed settings', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const homepage = 'http://127.0.0.1:4173/';
  await page.goto('/');
  await expect(page).toHaveURL(homepage);
  await page.goto(
    '/?collection=mosaic&seed=Ada+Moss&theme=auto&shape=rounded&view=sizes&contactSize=64#playground',
  );
  await expect(page).toHaveURL(homepage);
  await page.locator('#hero-cta').click();
  await expect(page).toHaveURL(homepage);
  await page.getByLabel('Colores', { exact: true }).selectOption('night');
  await expect(page).toHaveURL(`${homepage}?theme=night`);
  await page.locator('.site-nav-links a[href="#playground"]').click();
  await expect(page).toHaveURL(`${homepage}?theme=night#playground`);
  await page.locator('#share').click();
  await expect
    .poll(() => page.evaluate(() => navigator.clipboard.readText()))
    .toBe(`${homepage}?theme=night`);
  await page.getByLabel('Colores', { exact: true }).selectOption('auto');
  await expect(page).toHaveURL(homepage);
});

test('restores shared URL options, reviews 60 seeds at all sizes, and copies working code', async ({
  page,
  context,
}) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto(
    '/?collection=siesta&seed=Demo%20%26%20safe&view=variety&count=60&contactSize=32&accessory=blanket&body=cloud&theme=night&shape=circle&dark=1&background=0',
  );
  await page.getByRole('button', { name: 'Copiar instalación' }).click();
  await expect
    .poll(() => page.evaluate(() => navigator.clipboard.readText()))
    .toBe('npm i lazy-avatars');
  await expect(page.locator('#option-accessory')).toHaveValue('blanket');
  await expect(page.locator('#option-body')).toHaveValue('cloud');
  await expect(page.locator('#sizes img')).toHaveCount(60);
  const original = await page.locator('#output').textContent();
  await page.reload();
  await expect(page.locator('#output')).toHaveText(original ?? '');
  for (const size of ['24', '32', '64', '128']) {
    await page.getByLabel('Tamaño de las muestras', { exact: true }).selectOption(size);
    await expect(page.locator('#sizes img').first()).toHaveAttribute('width', size);
  }
  await page.locator('#copy-code').click();
  await expect(page.locator('.source-copy-action #copy-feedback')).toHaveText('Código copiado.');
  await expect(page.locator('#api-arrival img')).toHaveCount(1);
  await expect(page.locator('.api-thread')).toHaveCount(0);
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
  await expect(page.getByLabel('Colores', { exact: true })).toHaveValue('auto');
  await expect(page.locator('#sizes img')).toHaveCount(5);
  expect(external).toEqual([]);
});

for (const [collection, key, values] of [
  ['origami', 'animal', ['fox', 'cat', 'bear', 'owl']],
  ['pantry', 'food', ['donut', 'citrus', 'egg', 'avocado']],
  ['deco', 'motif', ['fan', 'arches', 'sun']],
  ['latte', 'art', ['heart', 'tulip', 'rosetta', 'rings']],
  ['tinbot', 'antenna', ['single', 'double', 'dome']],
  ['orbit', 'ring', ['none', 'thin', 'wide']],
  ['mission', 'badge', ['shield', 'round', 'hexagon']],
  ['helmet', 'visor', ['round', 'wide', 'angular']],
] as const) {
  test(`${collection}: forces each option, restores URL and fits mobile contact sheets`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`/?collection=${collection}&seed=Review&view=variety&count=60&contactSize=32`);
    await expect(page.locator('#collection option')).toHaveCount(13);
    const outputs: string[] = [];
    for (const value of values) {
      await page.locator(`#option-${key}`).selectOption(value);
      await expect(page).toHaveURL(new RegExp(`${key}=${value}`));
      const output = await page.locator('#output').textContent();
      outputs.push(output ?? '');
      await page.reload();
      await expect(page.locator(`#option-${key}`)).toHaveValue(value);
      await expect(page.locator('#output')).toHaveText(output ?? '');
      await expect(page.locator('#sizes img')).toHaveCount(60);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      );
    }
    expect(new Set(outputs.map((svg) => svg.replace(/la-[0-9a-f]+/g, 'avatar'))).size).toBe(
      values.length,
    );
  });
}

test('constellation has no option controls and drops options from other collections', async ({
  page,
}) => {
  await page.goto('/?collection=constellation&animal=fox&food=egg&art=heart&motif=sun');
  await expect(page.locator('#collection-options select')).toHaveCount(0);
  for (const key of ['animal', 'food', 'art', 'motif'])
    expect(new URL(page.url()).searchParams.has(key)).toBe(false);
  await expect(page.locator('#output')).toHaveText(
    createAvatar(constellation, { seed: 'Ada Moss' }),
  );
});

test('offers only four editor views and resets removed space URLs', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(
    '/?collection=mission&seed=Ada%20Moss&badge=hexagon&rocket=tilted&view=space&theme=night',
  );
  await expect(page.locator('button[data-view]')).toHaveCount(4);
  await expect(page.locator('button[data-view="space"]')).toHaveCount(0);
  await expect(page.locator('#sizes img')).toHaveCount(5);
  expect(new URL(page.url()).searchParams.has('view')).toBe(false);
  for (const view of ['variety', 'context', 'palettes']) {
    await page.locator(`button[data-view="${view}"]`).click();
    await expect(page.locator(`button[data-view="${view}"]`)).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(errors).toEqual([]);
});

import { expect, test } from '@playwright/test';
import { orbit } from '../../packages/core/src/collections/orbit/index.js';
import { rack } from '../../packages/core/src/collections/rack/index.js';
import { createAvatar } from '../../packages/core/src/index.js';

test('React hydrates SSR bytes without duplicate IDs, then updates repeated avatars', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });
  await page.goto('http://127.0.0.1:4175/');
  await expect(page.locator('#react-root svg')).toHaveCount(3);
  await expect.poll(() => page.evaluate(() => 'integrationReview' in window)).toBe(true);
  const review = await page.evaluate(() => {
    const r = (window as unknown as { integrationReview: { before: string; errors: string[] } })
      .integrationReview;
    const ids = Array.from(document.querySelectorAll('#react-root [id]'), (e) => e.id);
    return {
      same: r.before === document.getElementById('react-root')?.innerHTML,
      errors: r.errors,
      ids,
    };
  });
  expect(review.same).toBe(true);
  expect(review.errors).toEqual([]);
  expect(new Set(review.ids).size).toBe(review.ids.length);
  await expect(page.locator('#react-root svg[role="img"]')).toHaveCount(2);
  await expect(page.locator('#react-root svg[aria-hidden="true"]')).toHaveCount(1);
  const before = await page.locator('#react-root').innerHTML();
  await page.locator('#change-seed').click();
  await expect.poll(() => page.locator('#react-root').innerHTML()).not.toBe(before);
  expect(errors).toEqual([]);
});

test('web component explicitly registers collections, isolates IDs, reacts and recovers from errors', async ({
  page,
}) => {
  await page.goto('http://127.0.0.1:4175/');
  const elements = page.locator('lazy-avatar');
  await expect(elements.locator('svg')).toHaveCount(2);
  const matches = (expected: string) =>
    elements.first().evaluate((e, svg) => {
      const parsed = document.createElement('div');
      parsed.innerHTML = svg;
      return e.shadowRoot?.innerHTML === parsed.innerHTML;
    }, expected);
  expect(await matches(createAvatar(orbit, { seed: 'Ada Moss', title: 'Ada Moss' }))).toBe(true);
  // Identical IDs live in separate shadow roots, never in the shared document tree.
  expect(await page.evaluate(() => document.querySelectorAll('#elements [id]').length)).toBe(0);
  await elements.first().evaluate((e) => {
    e.setAttribute('collection', 'rack');
    e.setAttribute('options', '{"status":"warn"}');
    e.setAttribute('background', 'false');
  });
  expect(
    await matches(
      createAvatar(rack, {
        seed: 'Ada Moss',
        title: 'Ada Moss',
        background: false,
        options: { status: 'warn' },
      }),
    ),
  ).toBe(true);
  await elements.first().evaluate((e) => {
    e.addEventListener('avatar-error', () => e.setAttribute('data-event', 'yes'));
    e.setAttribute('seed', ' ');
  });
  await expect(elements.first()).toHaveAttribute('data-error', 'Invalid avatar attributes');
  await expect(elements.first()).toHaveAttribute('data-event', 'yes');
  await expect(elements.first().locator('svg')).toHaveCount(0);
  await elements.first().evaluate((e) => e.setAttribute('seed', 'Cora Oak'));
  await expect(elements.first()).not.toHaveAttribute('data-error');
  for (const [name, value] of [
    ['collection', 'mission'],
    ['collection', '__proto__'],
    ['options', '{'],
    ['size', '0'],
    ['background', '0'],
  ] as const) {
    await elements
      .first()
      .evaluate((e, [name, value]) => e.setAttribute(name, value), [name, value] as [
        string,
        string,
      ]);
    await expect(elements.first()).toHaveAttribute('data-error');
    await elements.first().evaluate((e) => {
      e.setAttribute('collection', 'rack');
      e.setAttribute('options', '{}');
      e.setAttribute('size', '64');
      e.setAttribute('background', 'true');
    });
  }
});

test('custom palette validates, previews contrast, restores URL and is present in copied API/React code', async ({
  page,
}) => {
  await page.goto('/?collection=orbit');
  await page.locator('#custom-palette').check();
  for (const [role, value] of Object.entries({
    background: '#fff',
    primary: '#357',
    secondary: '#789',
    accent: '#def',
    ink: '#123',
  }))
    await page.locator(`#color-${role}`).fill(value);
  await expect(page.locator('#palette-preview span')).toHaveCount(5);
  await expect(page.locator('#palette-contrast')).toContainText('ink/background:');
  const svg = await page.locator('#output').textContent();
  expect(svg).toBe(
    createAvatar(orbit, {
      seed: 'Ada Moss',
      palette: {
        background: '#fff',
        primary: '#357',
        secondary: '#789',
        accent: '#def',
        ink: '#123',
      },
    }),
  );
  await page.reload();
  await expect(page.locator('#custom-palette')).toBeChecked();
  await expect(page.locator('#color-primary')).toHaveValue('#357');
  await expect(page.locator('#output')).toHaveText(svg ?? '');
  await page.locator('[data-code="react"]').click();
  await expect(page.locator('#code')).toContainText('<Avatar');
  await expect(page.locator('#code')).toContainText('"primary": "#357"');
  await page.locator('#color-ink').fill('invalid');
  await expect(page.locator('#download')).toBeDisabled();
  await expect(page.locator('#palette-preview')).toBeEmpty();
  await page.reload();
  await expect(page.locator('#download')).toBeDisabled();
  await page.locator('#color-ink').fill('#123');
  await expect(page.locator('#download')).toBeEnabled();
  await page.locator('[data-view="palettes"]').click();
  await expect(page.locator('#sizes figure')).toHaveCount(7);
  await expect(page.locator('#sizes figure').first()).toContainText('Personalizada');
  await page.locator('#custom-palette').uncheck();
  await expect(page.locator('#sizes figure')).toHaveCount(6);
  await expect(page.locator('#theme')).toBeEnabled();
});

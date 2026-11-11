import { expect, test } from '@playwright/test';

test('published documentation is readable without JavaScript and sitemap routes exist', async ({
  browser,
  request,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    await page.goto('http://127.0.0.1:4173/');
    await expect(
      page.locator('.api-guide').getByRole('heading', { name: 'La API de lazy-avatars' }),
    ).toBeVisible();
    await expect(
      page.locator('.api-guide').getByRole('link', { name: 'Consulta la API y sus ejemplos' }),
    ).toHaveAttribute(
      'href',
      'https://github.com/paulaquiin/lazy-avatars/blob/main/packages/core/README.md',
    );
    await expect(page.getByRole('heading', { name: 'Preguntas frecuentes' })).toBeVisible();
    await expect(page.locator('.discovery').getByRole('link')).toHaveCount(0);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      'https://lazyavatars.paulaquiin.com/',
    );
    const sitemap = await request.get('/sitemap.xml');
    expect(sitemap.ok()).toBe(true);
    const urls = [...(await sitemap.text()).matchAll(/<loc>(.*?)<\/loc>/g)];
    expect(urls).toHaveLength(15);
    for (const [, url] of urls) {
      const path = new URL(url ?? '').pathname;
      const response = await request.get(path);
      expect(response.ok(), path).toBe(true);
      expect(await response.text()).toMatch(/<h1(?:\s[^>]*)?>/);
    }
    await page.goto('http://127.0.0.1:4173/collections/rack/');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Server rack SVG avatars');
    await expect(page.locator('.preview img')).toHaveJSProperty('naturalWidth', 128);
    await page.goto('http://127.0.0.1:4173/comparison/');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'lazy-avatars vs Boring Avatars vs DiceBear',
    );
    expect((await request.get('/social-preview.png')).ok()).toBe(true);
  } finally {
    await context.close();
  }
});

test('Siesta descends after copying the code', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('http://127.0.0.1:4173/');
  await page.locator('#copy-code').click();
  await expect(page.locator('#copy-feedback')).toHaveText('Código copiado.');
  await expect(page.locator('.api-thread')).toHaveCount(1);
  await expect
    .poll(() =>
      page.locator('.api-thread').evaluate((thread) => Number.parseFloat(thread.style.height)),
    )
    .toBeGreaterThan(100);
  await expect(page.locator('#api-arrival img')).toHaveCount(1);
  await expect(page.locator('.api-thread')).toHaveCount(0);
  await expect(page.locator('#api-arrival')).toHaveClass(/is-seated/);
  await expect(page.locator('#api-arrival')).toHaveCSS('animation-name', 'none');
  expect(
    await page
      .locator('#api-arrival')
      .evaluate((element) => getComputedStyle(element, '::before').animationName),
  ).toBe('api-leg-swing');
  const seated = await page.locator('#api-arrival').boundingBox();
  const apiLink = await page.locator('.api-guide-link').boundingBox();
  expect(seated && apiLink && seated.y + seated.height <= apiLink.y + 2).toBeTruthy();
  await expect(page.locator('.api-guide-link')).toBeFocused();

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.locator('#copy-code').click();
  await expect(page.locator('#api-arrival img')).toHaveCount(1);
  await expect(page.locator('.api-thread')).toHaveCount(0);
  expect(
    await page
      .locator('#api-arrival')
      .evaluate((element) => getComputedStyle(element, '::before').animationName),
  ).toBe('none');
});

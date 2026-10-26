import { expect, test } from '@playwright/test';

test('published documentation is readable without JavaScript and sitemap routes exist', async ({
  browser,
  request,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    await page.goto('http://127.0.0.1:4173/');
    await expect(page.locator('.collection-docs a')).toHaveCount(13);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      'https://paulaquiin.github.io/lazy-avatars/',
    );
    const sitemap = await request.get('/sitemap.xml');
    expect(sitemap.ok()).toBe(true);
    const urls = [...(await sitemap.text()).matchAll(/<loc>(.*?)<\/loc>/g)];
    expect(urls).toHaveLength(15);
    for (const [, url] of urls) {
      const path = new URL(url ?? '').pathname.replace('/lazy-avatars', '');
      const response = await request.get(path);
      expect(response.ok(), path).toBe(true);
      expect(await response.text()).toContain('<h1>');
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

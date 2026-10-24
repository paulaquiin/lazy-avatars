import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import { run } from '../packages/cli/src/index.js';
import { orbit } from '../packages/core/src/collections/orbit/index.js';
import { rack } from '../packages/core/src/collections/rack/index.js';
import { createAvatar } from '../packages/core/src/index.js';
import { createAvatarServer } from '../packages/http/src/index.js';
import { Avatar } from '../packages/react/src/index.js';
import { registerLazyAvatar } from '../packages/web-component/src/index.js';

test('React preserves core SVG bytes with an explicit prefix and typed options', () => {
  const options = {
    seed: 'Ada Moss',
    title: '<Orbit>',
    idPrefix: 'instance',
    options: { ring: 'wide' as const },
  };
  const html = renderToString(createElement(Avatar, { collection: orbit, ...options }));
  expect(html.slice(html.indexOf('<svg'), html.lastIndexOf('</span>'))).toBe(
    createAvatar(orbit, options),
  );
});
test('React SSR allocates separate accessible SVG IDs to repeated instances and roots', () => {
  const tree = createElement(
    'div',
    {},
    ...Array.from({ length: 4 }, () =>
      createElement(Avatar, { collection: orbit, seed: 'demo', title: 'Orbit' }),
    ),
  );
  const html =
    renderToString(tree, { identifierPrefix: 'one-' }) +
    renderToString(tree, { identifierPrefix: 'two-' });
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
  expect(new Set(ids).size).toBe(ids.length);
  for (const ref of html.matchAll(/(?:url\(#|aria-labelledby=")([^)"]+)/g))
    expect(ids).toContain(ref[1]);
  expect(html.match(/role="img"/g)).toHaveLength(8);
  expect(renderToString(createElement(Avatar, { collection: orbit, seed: 'demo' }))).toContain(
    'aria-hidden="true"',
  );
});
test('React reports invalid inputs and custom element import is SSR-safe', () => {
  expect(() => renderToString(createElement(Avatar, { collection: orbit, seed: ' ' }))).toThrow();
  expect(() => registerLazyAvatar({ collections: [orbit] })).toThrow('requires a browser');
});
test('CLI writes byte-identical SVG and keeps diagnostics out of stdout', () => {
  let out = '',
    err = '';
  const io = {
    stdout: (s: string) => {
      out += s;
    },
    stderr: (s: string) => {
      err += s;
    },
  };
  expect(run(['rack', 'demo', '--options', '{"status":"warn"}', '--theme', 'night'], io)).toBe(0);
  expect(out).toBe(
    createAvatar(rack, { seed: 'demo', palette: 'night', options: { status: 'warn' } }),
  );
  expect(err).toBe('');
  for (const args of [
    [],
    ['unknown', 'demo'],
    ['rack', ' '],
    ['rack', 'demo', '--bad', '1'],
    ['rack', 'demo', '--size', '-1'],
    ['rack', 'demo', '--options', '{"status":"bad"}'],
    ['rack', 'demo', '--options', '{'],
    ['rack', 'demo', '--size', '32', '--size', '64'],
  ]) {
    out = '';
    err = '';
    expect(run(args, io)).toBe(1);
    expect(out).toBe('');
    expect(err).toContain('invalid');
  }
  out = '';
  err = '';
  expect(run(['--help'], io)).toBe(0);
  expect(out).toContain('Usage:');
  expect(err).toBe('');
});

describe('self-hosted HTTP', () => {
  const server = createAvatarServer();
  let base = '';
  beforeAll(async () => {
    await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
    const a = server.address();
    if (!a || typeof a === 'string') throw new Error('No port');
    base = `http://127.0.0.1:${a.port}`;
  });
  afterAll(async () => {
    server.closeAllConnections();
    await new Promise<void>((resolve) => server.close(() => resolve()));
  });
  test('GET/HEAD, SVG parity, security headers, private cache and conditional requests', async () => {
    const path = '/orbit/Ada%20Moss.svg?theme=night&options=%7B%22ring%22%3A%22wide%22%7D';
    const response = await fetch(base + path);
    const svg = await response.text();
    expect(response.status).toBe(200);
    expect(svg).toBe(
      createAvatar(orbit, { seed: 'Ada Moss', palette: 'night', options: { ring: 'wide' } }),
    );
    expect(response.headers.get('content-type')).toBe('image/svg+xml; charset=utf-8');
    expect(response.headers.get('x-content-type-options')).toBe('nosniff');
    expect(response.headers.get('content-security-policy')).toContain('sandbox');
    expect(response.headers.get('cache-control')).toContain('private');
    const etag = response.headers.get('etag');
    expect(etag).toBeTruthy();
    const head = await fetch(base + path, { method: 'HEAD' });
    expect(head.status).toBe(200);
    expect(await head.text()).toBe('');
    expect(head.headers.get('etag')).toBe(etag);
    const cached = await fetch(base + path, { headers: { 'If-None-Match': `W/${etag}` } });
    expect(cached.status).toBe(304);
    expect(await cached.text()).toBe('');
    expect((await fetch(`${base}/orbit/Cora.svg`)).headers.get('etag')).not.toBe(etag);
  });
  test('rejects malformed routes, queries and inputs without reflecting seeds', async () => {
    for (const [path, code] of [
      ['/missing/demo.svg', 404],
      ['/rack/demo.png', 404],
      ['/rack/a/b.svg', 404],
      ['/rack/%ZZ.svg', 400],
      ['/rack/%20.svg', 400],
      ['/rack/demo.svg?size=0', 400],
      ['/rack/demo.svg?size=32&size=64', 400],
      ['/rack/demo.svg?theme=bogus', 400],
      ['/rack/demo.svg?unknown=1', 400],
      ['/rack/demo.svg?options=%7B%22status%22%3A%22bad%22%7D', 400],
      [`/rack/demo.svg?title=${'x'.repeat(4096)}`, 414],
    ] as const) {
      const r = await fetch(base + path);
      expect(r.status, path).toBe(code);
      expect(r.headers.get('cache-control')).toBe('no-store');
      expect(await r.text()).toBe(`${code}\n`);
    }
    const post = await fetch(`${base}/rack/demo.svg`, { method: 'POST' });
    expect(post.status).toBe(405);
    expect(post.headers.get('allow')).toBe('GET, HEAD');
    expect(await (await fetch(`${base}/healthz`)).text()).toBe('ok\n');
  });
});

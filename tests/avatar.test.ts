import { XMLParser, XMLValidator } from 'fast-xml-parser';
import { describe, expect, it } from 'vitest';
import { testCollection } from '../fixtures/test-collection.js';
import type { AvatarOptions, Collection } from '../packages/core/src/index.js';
import {
  createAvatar,
  createAvatarDataUri,
  svgElement,
  svgNumber,
  themes,
} from '../packages/core/src/index.js';

describe('avatar contract', () => {
  it('is byte-stable, normalizes seeds and canonicalizes option order', () => {
    const a = createAvatar(testCollection, {
      seed: ' Ána ',
      options: { initials: true, variant: 'disc' },
    });
    const b = createAvatar(testCollection, {
      seed: 'A\u0301na',
      options: { variant: 'disc', initials: true },
    });
    expect(a).toBe(b);
    expect(a).not.toBe(
      createAvatar(testCollection, { seed: 'ána', options: { variant: 'disc', initials: true } }),
    );
    expect(createAvatar(testCollection, { seed: 'demo' })).toBe(
      createAvatar(testCollection, { seed: 'demo', size: 64, shape: 'rounded', background: true }),
    );
  });

  it('pins 20 fixture outputs, including Unicode, title, shape and themes', () => {
    const seeds = [
      'Ána',
      '李 明',
      'demo-server-01',
      '🙂',
      ...Array.from({ length: 16 }, (_, i) => `demo-${i}`),
    ];
    expect(
      seeds.map((seed, i) =>
        createAvatar(testCollection, {
          seed,
          palette: i % 2 ? 'night' : 'pastel',
          shape: i % 3 ? 'circle' : 'square',
          title: seed,
        }),
      ),
    ).toMatchSnapshot();
  });

  it('produces valid escaped XML and an exactly round-trippable data URI', () => {
    const title = 'A < B & "C" \'D\' \u0000 \ud800';
    const svg = createAvatar(testCollection, { seed: 'demo', title });
    expect(XMLValidator.validate(svg)).toBe(true);
    expect(svg).toContain('&lt;');
    expect(svg).not.toMatch(/undefined|NaN|<script|onload=/);
    const parsed = new XMLParser({ ignoreAttributes: false }).parse(svg);
    expect(parsed.svg['@_viewBox']).toBe('0 0 80 80');
    expect(parsed.svg.title['#text']).toBe('A < B & "C" \'D\' � �');
    const uri = createAvatarDataUri(testCollection, { seed: 'demo', title });
    expect(decodeURIComponent(uri.split(',')[1] ?? '')).toBe(svg);
    expect(uri).not.toContain("'");
  });

  it('keeps IDs and local references consistent across inline instances', () => {
    const first = createAvatar(testCollection, { seed: 'same', idPrefix: 'row-a', title: 'First' });
    const second = createAvatar(testCollection, {
      seed: 'same',
      idPrefix: 'row-b',
      title: 'Second',
    });
    const ids = [...(first + second).matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
    expect(new Set(ids).size).toBe(ids.length);
    for (const ref of (first + second).matchAll(/(?:url\(#|aria-labelledby=")([^)"]+)/g)) {
      expect(ids).toContain(ref[1]);
    }
    expect(first).not.toContain('row-b');
  });

  it('separates collection IDs from wrapper IDs and does not mutate caller options', () => {
    const collection: Collection<{ detail: { count: number } }> = {
      ...testCollection,
      validateOptions: () => {},
      render: ({ id, options }) => {
        expect(Object.isFrozen(options.detail)).toBe(true);
        return svgElement('circle', { id: id('clip'), cx: 40, cy: 40, r: 20, fill: '#123' });
      },
    };
    const options = { detail: { count: 2 } };
    const svg = createAvatar(collection, { seed: 'demo', title: 'Demo', options });
    const ids = [...svg.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
    expect(new Set(ids).size).toBe(ids.length);
    expect(options).toEqual({ detail: { count: 2 } });
    expect(Object.isFrozen(options.detail)).toBe(false);
  });

  it('applies clipping and transparent backgrounds in the common wrapper', () => {
    const svg = createAvatar(testCollection, {
      seed: 'demo',
      shape: 'circle',
      background: false,
      size: 32,
    });
    expect(svg).toContain('<circle cx="40" cy="40" r="40"/>');
    expect(svg).toContain('width="32"');
    expect(svg).not.toContain('fill="#f4eee8"');
    expect(svg).toContain('aria-hidden="true"');
  });

  it('changes colors without consuming the shape stream', () => {
    const first = createAvatar(testCollection, {
      seed: 'demo',
      palette: 'night',
      options: { initials: false },
    });
    const second = createAvatar(testCollection, {
      seed: 'demo',
      palette: 'earth',
      options: { initials: false },
    });
    expect(first.match(/r="\d+"/)?.[0]).toBe(second.match(/r="\d+"/)?.[0]);
    expect(first).not.toBe(second);
  });

  it('validates common and collection-specific options at runtime', () => {
    const invalid = [
      { seed: '' },
      { seed: 'demo', size: NaN },
      { seed: 'demo', size: 0 },
      { seed: 'demo', size: 4097 },
      { seed: 'demo', size: null },
      { seed: 'demo', shape: 'triangle' },
      { seed: 'demo', background: 'yes' },
      { seed: 'demo', idPrefix: 'x" onload="alert(1)' },
      { seed: 'demo', palette: [] },
      { seed: 'demo', palette: 'missing' },
      { seed: 'demo', palette: { ...themes.night[0], ink: 'red' } },
      { seed: 'demo', options: { variant: 'wrong' } },
      { seed: 'demo', options: { unknown: true } },
      { seed: 'demo', options: null },
    ];
    for (const input of invalid)
      expect(() => createAvatar(testCollection, input as AvatarOptions)).toThrow();
    expect(() => createAvatar({ ...testCollection, outputVersion: 0 }, { seed: 'demo' })).toThrow();
  });

  it('rejects non-JSON, cyclic and nonfinite collection options before rendering', () => {
    const collection: Collection<{ value: unknown }> = {
      ...testCollection,
      validateOptions: () => {},
      render: () => '',
    };
    const cycle: Record<string, unknown> = {};
    cycle.self = cycle;
    for (const value of [NaN, Infinity, () => 1, 1n, new Date(), cycle, [undefined]]) {
      expect(() => createAvatar(collection, { seed: 'demo', options: { value } })).toThrow();
    }
  });
});

describe('SVG primitives', () => {
  it('rounds to one decimal and rejects unsafe numbers or active markup attributes', () => {
    expect(svgNumber(-0.01)).toBe('0');
    expect(svgNumber(1.26)).toBe('1.3');
    expect(() => svgNumber(NaN)).toThrow();
    expect(() => svgElement('rect', { onload: 'alert(1)' })).toThrow();
    expect(() => svgElement('rect', { fill: 'url(https://example.invalid)' })).toThrow();
    expect(() => svgElement('g', { 'clip-path': 'url(https://example.invalid)' })).toThrow();
  });
});

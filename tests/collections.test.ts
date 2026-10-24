import { XMLValidator } from 'fast-xml-parser';
import { describe, expect, it } from 'vitest';
import { contactSeeds } from '../fixtures/contact-seeds.js';
import { constellation } from '../packages/core/src/collections/constellation/index.js';
import { deco } from '../packages/core/src/collections/deco/index.js';
import { latte } from '../packages/core/src/collections/latte/index.js';
import { monogram } from '../packages/core/src/collections/monogram/index.js';
import { mosaic } from '../packages/core/src/collections/mosaic/index.js';
import { origami } from '../packages/core/src/collections/origami/index.js';
import { pantry } from '../packages/core/src/collections/pantry/index.js';
import { rack, statusColors } from '../packages/core/src/collections/rack/index.js';
import { siesta } from '../packages/core/src/collections/siesta/index.js';
import type { Collection } from '../packages/core/src/index.js';
import { createAvatar, themes } from '../packages/core/src/index.js';

const collections: readonly Collection<object>[] = [
  mosaic,
  monogram,
  rack,
  siesta,
  origami,
  pantry,
  deco,
  latte,
  constellation,
];

for (const collection of collections) {
  describe(collection.id, () => {
    it('pins 20 stable seed outputs', () => {
      expect(
        contactSeeds.slice(0, 20).map((seed) => createAvatar(collection, { seed })),
      ).toMatchSnapshot();
    });

    it('renders valid self-contained SVG for 60 seeds in all themes and shapes', () => {
      let largest = 0;
      for (const [index, seed] of contactSeeds.entries()) {
        for (const palette of [undefined, ...Object.keys(themes)] as const) {
          const svg = createAvatar(collection, {
            seed,
            ...(palette === undefined ? {} : { palette: palette as keyof typeof themes }),
            shape: (['square', 'rounded', 'circle'] as const)[index % 3] ?? 'square',
            title: '<Demo & example>',
          });
          expect(XMLValidator.validate(svg)).toBe(true);
          expect(svg).not.toMatch(/NaN|undefined|<text|<script|foreignObject|onload=|href=/);
          const ids = [...svg.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
          expect(new Set(ids).size).toBe(ids.length);
          for (const reference of svg.matchAll(/(?:url\(#|aria-labelledby=")([^)"]+)/g))
            expect(ids).toContain(reference[1]);
          largest = Math.max(largest, new TextEncoder().encode(svg).length);
        }
      }
      expect(largest).toBeLessThanOrEqual(4096);
    });

    it('does not produce exact visual twins in the review contact sheet', () => {
      const outputs = contactSeeds.map((seed) =>
        createAvatar(collection, { seed }).replace(/la-[0-9a-f]+/g, 'avatar'),
      );
      expect(new Set(outputs).size).toBe(outputs.length);
    });

    it('rejects unknown keys instead of silently dropping mistakes', () => {
      expect(() =>
        createAvatar(collection, { seed: 'demo', options: { unknown: 'value' } }),
      ).toThrow();
    });
  });
}

it('forces every primary variant and validates collection-specific enums', () => {
  for (const tile of ['arcs', 'triangles'] as const)
    expect(createAvatar(mosaic, { seed: 'demo', options: { tile } })).toContain(
      tile === 'arcs' ? 'A10' : 'M0 0H20V20Z',
    );
  for (const frame of ['circle', 'shield', 'diamond'] as const)
    expect(createAvatar(monogram, { seed: 'demo', options: { frame } })).toContain(
      frame === 'circle' ? 'r="34"' : frame === 'shield' ? 'M9 10' : 'M40 3',
    );
  for (const accessory of ['cap', 'zzz', 'mask', 'blanket', 'none'] as const)
    expect(
      XMLValidator.validate(createAvatar(siesta, { seed: 'demo', options: { accessory } })),
    ).toBe(true);
  for (const body of ['round', 'pear', 'cloud'] as const)
    for (const mouth of ['smile', 'yawn', 'sleep'] as const)
      expect(
        XMLValidator.validate(createAvatar(siesta, { seed: 'demo', options: { body, mouth } })),
      ).toBe(true);
  for (const collection of collections)
    expect(() =>
      createAvatar(collection, {
        seed: 'demo',
        options: {
          [collection.id === 'mosaic'
            ? 'tile'
            : collection.id === 'monogram'
              ? 'frame'
              : collection.id === 'rack'
                ? 'status'
                : 'accessory']: 'invalid',
        },
      }),
    ).toThrow();
});

it('keeps Rack state colors independent of themes and defaults to off', () => {
  for (const status of ['ok', 'warn', 'down', 'off'] as const) {
    for (const palette of Object.keys(themes) as (keyof typeof themes)[]) {
      expect(createAvatar(rack, { seed: 'demo', palette, options: { status } })).toContain(
        `fill="${statusColors[status]}"`,
      );
    }
  }
  expect(createAvatar(rack, { seed: 'demo' })).toContain(`fill="${statusColors.off}"`);
  for (const unit of ['disks', 'vent'] as const)
    expect(XMLValidator.validate(createAvatar(rack, { seed: 'demo', options: { unit } }))).toBe(
      true,
    );
});

it('renders Latin initials and unsupported alphabets using original paths only', () => {
  for (const collection of [monogram, rack] as readonly Collection<object>[])
    for (const seed of ['Ána García', '李 明', '🙂', '42', 'W M', 'Q Y']) {
      const svg = createAvatar(collection, { seed });
      expect(XMLValidator.validate(svg)).toBe(true);
      expect(svg).toContain('<path');
      expect(svg).not.toMatch(/<text|font-family|https:\/\//);
    }
});

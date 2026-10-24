import { XMLParser, XMLValidator } from 'fast-xml-parser';
import { describe, expect, it } from 'vitest';
import { contactSeeds } from '../fixtures/contact-seeds.js';
import { constellation } from '../packages/core/src/collections/constellation/index.js';
import { deco } from '../packages/core/src/collections/deco/index.js';
import { latte } from '../packages/core/src/collections/latte/index.js';
import { origami } from '../packages/core/src/collections/origami/index.js';
import { pantry } from '../packages/core/src/collections/pantry/index.js';
import { contrastRatio, createAvatar, createRng, themes } from '../packages/core/src/index.js';
import type { Collection } from '../packages/core/src/types.js';

const variants: readonly [Collection<object>, string, readonly string[]][] = [
  [origami, 'animal', ['fox', 'cat', 'bear', 'owl']],
  [pantry, 'food', ['donut', 'citrus', 'egg', 'avocado']],
  [deco, 'motif', ['fan', 'arches', 'sun']],
  [latte, 'art', ['heart', 'tulip', 'rosetta', 'rings']],
];

for (const [collection, key, values] of variants) {
  describe(`${collection.id} forced variants`, () => {
    it('renders distinct geometry for every primary variant across themes', () => {
      for (const palette of [undefined, ...Object.keys(themes)] as const) {
        const outputs = values.map((value) => {
          const svg = createAvatar(collection, {
            seed: 'fixed-variant',
            ...(palette ? { palette: palette as keyof typeof themes } : {}),
            options: { [key]: value },
          });
          expect(XMLValidator.validate(svg)).toBe(true);
          return svg.replace(/la-[0-9a-f]+/g, 'avatar');
        });
        expect(new Set(outputs).size).toBe(values.length);
      }
    });
    it('rejects wrong enums and non-string values', () => {
      for (const value of ['unknown', 1, null, true])
        expect(() =>
          createAvatar(collection, { seed: 'demo', options: { [key]: value } }),
        ).toThrow();
    });
  });
}

it('keeps all new collection output valid at every review size with transparent backgrounds', () => {
  for (const collection of [
    origami,
    pantry,
    deco,
    latte,
    constellation,
  ] as readonly Collection<object>[])
    for (const seed of contactSeeds)
      for (const size of [24, 32, 64, 128]) {
        const svg = createAvatar(collection, { seed, size, background: false, shape: 'circle' });
        expect(XMLValidator.validate(svg)).toBe(true);
        expect(svg).toContain(`width="${size}"`);
      }
});

it('keeps constellation stars apart, within circular crops, and lines above 3:1 contrast', () => {
  const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '' });
  const allPalettes = [...constellation.palettes, ...Object.values(themes).flat()];
  for (const seed of contactSeeds) {
    for (const palette of allPalettes) {
      const body = constellation.render({
        seed,
        initials: '',
        options: {},
        palette,
        rng: createRng(seed),
        id: (id) => id,
      });
      const group = parser.parse(`<g>${body}</g>`).g;
      const graph = group.path.find((path: { stroke?: string }) => path.stroke);
      expect(graph['stroke-width']).toBe('2.5');
      expect(contrastRatio(palette.background, graph.stroke)).toBeGreaterThanOrEqual(3);
      const points = [...graph.d.matchAll(/[ML](-?[\d.]+) (-?[\d.]+)/g)].map((match) => ({
        x: Number(match[1]),
        y: Number(match[2]),
      }));
      expect(points.length).toBeGreaterThanOrEqual(4);
      expect(points.length).toBeLessThanOrEqual(6);
      for (const [index, point] of points.entries()) {
        expect(Math.hypot(point.x - 40, point.y - 40)).toBeLessThan(29);
        for (const other of points.slice(index + 1))
          expect(Math.hypot(point.x - other.x, point.y - other.y)).toBeGreaterThan(13);
      }
      for (const star of group.circle.filter((circle: { opacity?: string }) => !circle.opacity))
        expect(contrastRatio(palette.background, star.fill)).toBeGreaterThanOrEqual(3);
      expect(
        contrastRatio(
          palette.background,
          group.path.find((path: { fill?: string }) => path.fill !== 'none').fill,
        ),
      ).toBeGreaterThanOrEqual(3);
    }
  }
});

it('keeps Deco structural lines at least one pixel at 32px in every palette', () => {
  const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '' });
  for (const palette of [...deco.palettes, ...Object.values(themes).flat()])
    for (const motif of ['fan', 'arches', 'sun'] as const) {
      const body = deco.render({
        seed: 'demo',
        initials: '',
        options: { motif },
        palette,
        rng: createRng('demo'),
        id: (id) => id,
      });
      const paths = parser.parse(`<g>${body}</g>`).g.path;
      for (const path of paths.filter((path: { stroke?: string }) => path.stroke)) {
        expect(Number(path['stroke-width'])).toBeGreaterThanOrEqual(2.5);
        expect(contrastRatio(palette.background, path.stroke)).toBeGreaterThanOrEqual(3);
      }
    }
});

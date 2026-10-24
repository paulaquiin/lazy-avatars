import { XMLValidator } from 'fast-xml-parser';
import { describe, expect, it } from 'vitest';
import { contactSeeds } from '../fixtures/contact-seeds.js';
import { helmet } from '../packages/core/src/collections/helmet/index.js';
import { renderMissionInitials } from '../packages/core/src/collections/mission/glyphs.js';
import { mission } from '../packages/core/src/collections/mission/index.js';
import { orbit } from '../packages/core/src/collections/orbit/index.js';
import { tinbot } from '../packages/core/src/collections/tinbot/index.js';
import { contrastRatio, createAvatar, themes } from '../packages/core/src/index.js';
import type { Collection } from '../packages/core/src/types.js';

const variants: readonly [Collection<object>, Readonly<Record<string, readonly string[]>>][] = [
  [
    tinbot,
    {
      antenna: ['single', 'double', 'dome'],
      eyes: ['gauges', 'visor', 'mixed'],
      mouth: ['grille', 'smile', 'dots'],
    },
  ],
  [
    orbit,
    { surface: ['bands', 'craters'], ring: ['none', 'thin', 'wide'], moon: ['none', 'small'] },
  ],
  [
    mission,
    {
      badge: ['shield', 'round', 'hexagon'],
      planet: ['striped', 'ringed', 'cratered'],
      rocket: ['upright', 'tilted'],
    },
  ],
  [
    helmet,
    {
      visor: ['round', 'wide', 'angular'],
      reflection: ['ringed', 'cratered', 'crescent'],
      antenna: ['none', 'single', 'double'],
    },
  ],
];

for (const [collection, fields] of variants) {
  describe(`${collection.id} variants`, () => {
    it('forces every named variant to distinct visible geometry in every theme', () => {
      for (const [key, values] of Object.entries(fields))
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
    it('rejects invalid values for every option rather than coercing them', () => {
      for (const key of Object.keys(fields))
        for (const value of ['unknown', true, 1, null])
          expect(() =>
            createAvatar(collection, { seed: 'demo', options: { [key]: value } }),
          ).toThrow();
    });
  });
}

it('keeps repeated inline clips isolated for planets, badges and visors', () => {
  for (const collection of [orbit, mission, helmet] as readonly Collection<object>[]) {
    const svg = ['instance-a', 'instance-b']
      .map((idPrefix) => createAvatar(collection, { seed: 'Ada Moss', idPrefix }))
      .join('');
    const ids = [...svg.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
    expect(new Set(ids).size).toBe(ids.length);
    for (const match of svg.matchAll(/url\(#([^)]+)\)/g)) expect(ids).toContain(match[1]);
  }
});

it('renders all original sans glyphs and neutral fallback as valid, font-free paths', () => {
  const outputs = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789?'].map((char) =>
    renderMissionInitials(char, '#111111'),
  );
  expect(new Set(outputs).size).toBe(37);
  for (const body of outputs) {
    expect(XMLValidator.validate(`<svg xmlns="http://www.w3.org/2000/svg">${body}</svg>`)).toBe(
      true,
    );
    expect(body).not.toMatch(/<text|font|href|NaN|undefined/);
  }
  expect(renderMissionInitials('李', '#111111')).toBe(renderMissionInitials('?', '#111111'));
  for (const seed of ['Ána García', '李 明', '🙂', '42', 'W W', 'Q Y'])
    expect(XMLValidator.validate(createAvatar(mission, { seed }))).toBe(true);
});

it('draws both ring halves in the correct layer order and omits both when disabled', () => {
  const none = createAvatar(orbit, {
    seed: 'ring-review',
    options: { ring: 'none', moon: 'none' },
  });
  expect(none).not.toContain('M7 40C7 54.7 73 54.7 73 40');
  expect(none).not.toContain('rx="33"');
  for (const ring of ['thin', 'wide'] as const) {
    const svg = createAvatar(orbit, { seed: 'ring-review', options: { ring } });
    const back = svg.indexOf('rx="33"');
    const surface = svg.indexOf('<g clip-path=', back);
    const front = svg.indexOf('M7 40C7 54.7 73 54.7 73 40');
    expect(back).toBeGreaterThan(0);
    expect(surface).toBeGreaterThan(back);
    expect(front).toBeGreaterThan(surface);
  }
});

it('renders 60 seeds in every review size with transparent circular crops', () => {
  for (const [collection] of variants)
    for (const seed of contactSeeds)
      for (const size of [24, 32, 64, 128]) {
        const svg = createAvatar(collection, { seed, size, shape: 'circle', background: false });
        expect(XMLValidator.validate(svg)).toBe(true);
        expect(svg).not.toMatch(/NaN|undefined/);
      }
});

it('keeps the Mission rocket window visible against its body in every palette', () => {
  for (const palette of [...mission.palettes, ...Object.values(themes).flat()]) {
    const svg = createAvatar(mission, { seed: 'rocket-contrast', palette });
    const body = [...svg.matchAll(/<path\b[^>]+>/g)]
      .map((match) => match[0])
      .find((path) => path.includes('M39 36V28'));
    const window = [...svg.matchAll(/<circle\b[^>]+>/g)]
      .map((match) => match[0])
      .find((circle) => circle.includes('cx="44"') && circle.includes('cy="28"'));
    expect(body).toBeDefined();
    expect(window).toBeDefined();
    const fill = body?.match(/fill="([^"]+)"/)?.[1] ?? '';
    const windowFill = window?.match(/fill="([^"]+)"/)?.[1] ?? '';
    expect(contrastRatio(fill, windowFill)).toBeGreaterThanOrEqual(3);
  }
});

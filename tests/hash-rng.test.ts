import { describe, expect, it } from 'vitest';
import { createRng, hashString, normalizeSeed } from '../packages/core/src/index.js';

describe('hash and normalization', () => {
  it.each([
    ['', 0x811c9dc5],
    ['a', 0xe40c292c],
    ['foobar', 0xbf9cf968],
  ])('matches FNV-1a vector %j', (value, expected) => {
    expect(hashString(value)).toBe(expected);
  });

  it('hashes Unicode as UTF-8, independently of UTF-16 code units', () => {
    const bytes = Buffer.from('é🙂', 'utf8');
    let expected = 0x811c9dc5;
    for (const byte of bytes) expected = Math.imul(expected ^ byte, 16777619) >>> 0;
    expect(hashString('é🙂')).toBe(expected);
    expect(normalizeSeed('  A\u0301na ')).toBe('Ána');
    expect(normalizeSeed('Ana')).not.toBe(normalizeSeed('ana'));
  });

  it('rejects blank, oversized and non-string seeds', () => {
    for (const seed of ['', ' \n ', 'a'.repeat(1025)]) expect(() => normalizeSeed(seed)).toThrow();
    // @ts-expect-error deliberate JavaScript misuse
    expect(() => normalizeSeed(12)).toThrow(TypeError);
  });
});

describe('random streams', () => {
  it('matches the mulberry32 seed-1 vector', () => {
    const rng = createRng(1);
    expect(Array.from({ length: 4 }, () => rng.next() * 2 ** 32)).toEqual([
      2693262067, 11749833, 2265367787, 4213581821,
    ]);
  });

  it('forks independently of consumption and preserves nested paths', () => {
    const rng = createRng('example');
    const expected = rng.fork('eyes').next();
    rng.next();
    rng.fork('palette').next();
    expect(rng.fork('eyes').next()).toBe(expected);
    expect(rng.fork('a').fork('bc').next()).not.toBe(rng.fork('ab').fork('c').next());
    expect(rng.fork('eyes').next()).not.toBe(rng.fork('palette').next());
  });

  it('honors helper bounds and zero-weight exclusions', () => {
    const rng = createRng(42);
    for (let index = 0; index < 100; index++) {
      expect(rng.int(1, 3)).toBeGreaterThanOrEqual(1);
      expect(rng.range(-2, 1)).toBeLessThan(1);
      expect(rng.pick(['a', 'b'])).toMatch(/^[ab]$/);
      expect(
        rng.weighted([
          { value: 'never', weight: 0 },
          { value: 'yes', weight: 1 },
        ]),
      ).toBe('yes');
    }
    expect(rng.chance(0)).toBe(false);
    expect(rng.chance(1)).toBe(true);
    expect(rng.int(7, 7)).toBe(7);
    for (const action of [
      () => rng.pick([]),
      () => rng.range(1, 0),
      () => rng.range(0, Infinity),
      () => rng.int(0.5, 2),
      () => rng.chance(NaN),
      () => rng.chance(2),
      () => rng.weighted([]),
      () => rng.weighted([{ value: 1, weight: -1 }]),
      () => createRng(-1),
    ]) {
      expect(action).toThrow();
    }
  });
});

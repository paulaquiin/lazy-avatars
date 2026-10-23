import { hashString } from './hash.js';

export interface Rng {
  next(): number;
  range(min: number, max: number): number;
  int(min: number, max: number): number;
  chance(probability: number): boolean;
  pick<T>(values: readonly T[]): T;
  weighted<T>(values: readonly { readonly value: T; readonly weight: number }[]): T;
  fork(name: string): Rng;
}

function bounds(min: number, max: number): void {
  if (!Number.isFinite(min) || !Number.isFinite(max) || max < min || !Number.isFinite(max - min)) {
    throw new RangeError('RNG bounds must be finite and ordered');
  }
}

function stream(root: number, path: readonly string[]): Rng {
  let state = path.length ? hashString(JSON.stringify([root, path])) : root;
  const next = () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = Math.imul(state ^ (state >>> 15), state | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
  return Object.freeze({
    next,
    range(min: number, max: number) {
      bounds(min, max);
      return min + next() * (max - min);
    },
    int(min: number, max: number) {
      bounds(min, max);
      if (!Number.isSafeInteger(min) || !Number.isSafeInteger(max) || max - min >= 2 ** 32) {
        throw new RangeError(
          'Integer bounds must be safe integers spanning fewer than 2^32 values',
        );
      }
      return min + Math.floor(next() * (max - min + 1));
    },
    chance(probability: number) {
      if (!Number.isFinite(probability) || probability < 0 || probability > 1) {
        throw new RangeError('Probability must be between 0 and 1');
      }
      return next() < probability;
    },
    pick<T>(values: readonly T[]) {
      if (!values.length) throw new RangeError('Cannot pick from an empty list');
      return values[Math.floor(next() * values.length)] as T;
    },
    weighted<T>(values: readonly { readonly value: T; readonly weight: number }[]) {
      const total = values.reduce((sum, entry) => {
        if (!Number.isFinite(entry.weight) || entry.weight < 0) {
          throw new RangeError('Weights must be finite and nonnegative');
        }
        return sum + entry.weight;
      }, 0);
      if (!(total > 0) || !Number.isFinite(total)) throw new RangeError('Invalid total weight');
      const target = next() * total;
      let cumulative = 0;
      for (const entry of values) {
        cumulative += entry.weight;
        if (entry.weight > 0 && target < cumulative) return entry.value;
      }
      // Floating-point rounding can leave target at the cumulative boundary.
      return values.filter((entry) => entry.weight > 0).at(-1)?.value as T;
    },
    fork(name: string) {
      if (typeof name !== 'string' || !name.length)
        throw new TypeError('fork needs a nonempty name');
      return stream(root, [...path, name]);
    },
  });
}

export function createRng(seed: string | number): Rng {
  if (typeof seed === 'number' && (!Number.isInteger(seed) || seed < 0 || seed > 0xffffffff)) {
    throw new RangeError('Numeric RNG seeds must be uint32 integers');
  }
  if (typeof seed !== 'number' && typeof seed !== 'string') throw new TypeError('Invalid RNG seed');
  return stream(typeof seed === 'string' ? hashString(seed) : seed, []);
}

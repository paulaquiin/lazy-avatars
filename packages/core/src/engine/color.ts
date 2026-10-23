import type { Palette } from '../types.js';
import { isPlainObject } from './canonical.js';

const roles = ['background', 'primary', 'secondary', 'accent', 'ink'] as const;

export function normalizeColor(color: string): string {
  if (typeof color !== 'string' || !/^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i.test(color)) {
    throw new TypeError('Colors must be #RGB or #RRGGBB hex values');
  }
  const hex = color.slice(1).toLowerCase();
  return `#${hex.length === 3 ? Array.from(hex, (digit) => digit + digit).join('') : hex}`;
}

export function normalizePalette(palette: Palette): Palette {
  if (!isPlainObject(palette) || Object.keys(palette).length !== roles.length) {
    throw new TypeError('A palette must contain exactly the five color roles');
  }
  return Object.freeze(
    Object.fromEntries(
      roles.map((role) => [role, normalizeColor(palette[role])]),
    ) as unknown as Palette,
  );
}

function luminance(color: string): number {
  const normalized = normalizeColor(color);
  const channels = [1, 3, 5].map((offset) => {
    const channel = Number.parseInt(normalized.slice(offset, offset + 2), 16) / 255;
    return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return (channels[0] ?? 0) * 0.2126 + (channels[1] ?? 0) * 0.7152 + (channels[2] ?? 0) * 0.0722;
}

export function contrastRatio(first: string, second: string): number {
  const a = luminance(first);
  const b = luminance(second);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

/** First candidate reaching 3:1; otherwise whichever of black/white contrasts best. */
export function readable(background: string, ...candidates: readonly string[]): string {
  const normalized = normalizeColor(background);
  const valid = candidates.map(normalizeColor);
  return (
    valid.find((candidate) => contrastRatio(normalized, candidate) >= 3) ??
    (contrastRatio(normalized, '#000000') >= contrastRatio(normalized, '#ffffff')
      ? '#000000'
      : '#ffffff')
  );
}

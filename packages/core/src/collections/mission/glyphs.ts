import { svgElement as el } from '../../engine/svg.js';

// Original sans centerline alphabet on a 6×8 grid; no font files or outlines.
const glyphs: Readonly<Record<string, string>> = Object.freeze({
  A: 'M0 8L3 0L6 8M1 5H5',
  B: 'M0 0V8H3Q7 8 5 4Q8 0 3 0ZM0 4H5',
  C: 'M6 1Q0-2 0 4T6 7',
  D: 'M0 0V8H2Q6 8 6 4T2 0Z',
  E: 'M6 0H0V8H6M0 4H5',
  F: 'M6 0H0V8M0 4H5',
  G: 'M6 1Q0-2 0 4T6 7V4H3',
  H: 'M0 0V8M6 0V8M0 4H6',
  I: 'M1 0H5M3 0V8M1 8H5',
  J: 'M1 0H6V5Q6 10 0 7',
  K: 'M0 0V8M6 0L0 4L6 8',
  L: 'M0 0V8H6',
  M: 'M0 8V0L3 4L6 0V8',
  N: 'M0 8V0L6 8V0',
  O: 'M3 0Q0 0 0 4T3 8Q6 8 6 4T3 0Z',
  P: 'M0 8V0H3Q7 0 6 3Q6 4 3 4H0',
  Q: 'M3 0Q0 0 0 4T3 8Q6 8 6 4T3 0ZM4 6L7 9',
  R: 'M0 8V0H3Q6 0 6 2T3 4H0M3 4L6 8',
  S: 'M6 1Q0-2 0 2T3 4Q7 4 6 7Q3 10 0 7',
  T: 'M0 0H6M3 0V8',
  U: 'M0 0V5Q0 8 3 8T6 5V0',
  V: 'M0 0L3 8L6 0',
  W: 'M0 0L1 8L3 4L5 8L6 0',
  X: 'M0 0L6 8M6 0L0 8',
  Y: 'M0 0L3 4L6 0M3 4V8',
  Z: 'M0 0H6L0 8H6',
  0: 'M3 0Q0 0 0 4T3 8Q6 8 6 4T3 0ZM1 6L5 2',
  1: 'M1 2L3 0V8M1 8H5',
  2: 'M0 1Q6-2 6 2Q6 4 0 8H6',
  3: 'M0 0H5L2 4Q6 3 6 6T0 7',
  4: 'M5 8V0L0 5H6',
  5: 'M6 0H0V4H3Q7 4 6 7T0 7',
  6: 'M5 0Q0 0 0 5T3 8Q6 8 6 5T0 5',
  7: 'M0 0H6L2 8',
  8: 'M3 0Q0 0 0 2T3 4Q6 4 6 2T3 0ZM3 4Q0 4 0 6T3 8Q6 8 6 6T3 4Z',
  9: 'M1 8Q6 8 6 3T3 0Q0 0 0 3T6 3',
  '?': 'M0 1Q6-2 6 2L3 5M3 8v.1',
});

export function renderMissionInitials(text: string, ink: string): string {
  const chars = Array.from(text).slice(0, 2);
  const width = (chars.length * 9 - 3) * 1.4;
  return el(
    'g',
    {
      transform: `translate(${40 - width / 2} 55) scale(1.4)`,
      fill: 'none',
      stroke: ink,
      'stroke-width': 1.7,
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
    },
    chars
      .map((char, index) =>
        el('path', {
          d: glyphs[char] ?? glyphs['?'] ?? '',
          transform: `translate(${index * 9} 0)`,
        }),
      )
      .join(''),
  );
}

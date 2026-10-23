import { svgElement as el } from './svg.js';

// Original centerline serif alphabet, designed on a 10×14 grid. No font is embedded.
const paths: Readonly<Record<string, string>> = Object.freeze({
  A: 'M0 14 5 0 10 14M2 9H8M-1 14H3M7 14H11M3 0H7',
  B: 'M1 0V14M1 0H6C11 0 11 7 6 7H1M6 7C12 7 12 14 6 14H-1M-1 0H3',
  C: 'M10 3V0M10 2C4-2 0 1 0 7S4 16 10 12M8 0H11',
  D: 'M1 0V14M-1 0H4C13 0 13 14 4 14H-1',
  E: 'M10 3V0H1V14H10V11M1 7H8M8 5V9M-1 0H3M-1 14H3',
  F: 'M10 3V0H1V14M1 7H8M8 5V9M-1 0H3M-1 14H4',
  G: 'M10 3V0M10 2C4-2 0 1 0 7S4 16 10 12V8H6M8 8H11',
  H: 'M1 0V14M9 0V14M1 7H9M-1 0H3M7 0H11M-1 14H3M7 14H11',
  I: 'M5 0V14M1 0H9M1 14H9',
  J: 'M8 0V10C8 16 0 16 0 10M5 0H11',
  K: 'M1 0V14M9 0 1 8M4 5 10 14M-1 0H3M7 0H11M-1 14H3M7 14H11',
  L: 'M1 0V14H10V11M-1 0H4M-1 14H3',
  M: 'M0 14V0L5 9 10 0V14M-2 14H2M8 14H12M-1 0H2M8 0H11',
  N: 'M0 14V0L10 14V0M-2 14H2M8 0H12M-2 0H1M9 14H12',
  O: 'M5 0C-2 0-2 14 5 14S12 0 5 0Z',
  P: 'M1 14V0H6C12 0 12 8 6 8H1M-1 0H3M-1 14H4',
  Q: 'M5 0C-2 0-2 14 5 14S12 0 5 0ZM6 10 11 16',
  R: 'M1 14V0H6C12 0 12 7 6 7H1M5 7 10 14M-1 0H3M-1 14H4M7 14H12',
  S: 'M10 3V0M10 2C5-2 0 0 0 4S10 7 10 11 4 16 0 12M0 11V14',
  T: 'M0 3V0H10V3M5 0V14M2 14H8',
  U: 'M0 0V10C0 16 10 16 10 10V0M-2 0H2M8 0H12',
  V: 'M0 0 5 14 10 0M-2 0H3M7 0H12',
  W: 'M-1 0 2 14 5 5 8 14 11 0M-3 0H1M9 0H13',
  X: 'M0 0 10 14M10 0 0 14M-2 0H3M7 0H12M-2 14H3M7 14H12',
  Y: 'M0 0 5 7 10 0M5 7V14M-2 0H3M7 0H12M2 14H8',
  Z: 'M0 3V0H10L0 14H10V11',
  0: 'M5 0C-1 0-1 14 5 14S11 0 5 0Z',
  1: 'M2 3 6 0V14M2 14H10',
  2: 'M0 3C0-2 10-1 10 3S3 10 0 14H10V11',
  3: 'M0 1C10-3 14 6 5 7C14 7 12 17 0 13',
  4: 'M8 14V0L0 10H11M5 14H11',
  5: 'M10 0H1V6C13 2 13 18 0 13',
  6: 'M9 1C-1-3-4 17 5 14C14 13 10 4 1 7',
  7: 'M0 3V0H10L3 14M0 14H6',
  8: 'M5 7C-4 7-1-2 5 0S13 7 5 7C-4 7-1 16 5 14S14 7 5 7Z',
  9: 'M1 13C11 17 14-3 5 0C-4 1 0 10 9 7',
  '?': 'M0 3C0-2 10-1 10 3S5 7 5 10M5 13V14',
});

export function renderSerifInitials(initials: string, ink: string): string {
  const scale = initials.length === 1 ? 1.8 : 1.5;
  const width = initials.length === 1 ? 10 : 24;
  return el(
    'g',
    {
      transform: `translate(${40 - (width * scale) / 2} ${40 - 7 * scale}) scale(${scale})`,
      fill: 'none',
      stroke: ink,
      'stroke-width': 1.25,
      'stroke-linecap': 'square',
      'stroke-linejoin': 'round',
    },
    Array.from(initials, (char, index) =>
      el('path', { d: paths[char] ?? paths['?'], transform: `translate(${index * 14} 0)` }),
    ).join(''),
  );
}

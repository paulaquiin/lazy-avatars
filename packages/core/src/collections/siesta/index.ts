import { validateChoices } from '../../engine/collection.js';
import { readable } from '../../engine/color.js';
import { svgElement as el, svgNumber } from '../../engine/svg.js';
import type { Collection } from '../../types.js';
import { palettes } from './palettes.js';

export interface SiestaOptions {
  accessory: 'cap' | 'zzz' | 'mask' | 'blanket' | 'none';
  body: 'round' | 'pear' | 'cloud';
  mouth: 'smile' | 'yawn' | 'sleep';
}

const bodies = {
  round: 'M16 45C12 28 23 18 40 18S68 28 64 45C69 63 55 70 40 66C24 71 11 63 16 45Z',
  pear: 'M25 30C24 13 55 12 55 30C65 38 70 57 59 65C49 72 29 72 19 64C9 55 17 39 25 30Z',
  cloud:
    'M16 40C8 30 18 18 29 23C32 12 50 12 53 24C68 17 74 35 64 43C74 61 60 70 45 66C28 73 8 64 16 40Z',
};

export const siesta = Object.freeze<Collection<SiestaOptions>>({
  id: 'siesta',
  name: 'Siesta',
  outputVersion: 1,
  palettes,
  usesInitials: false,
  validateOptions: (options) =>
    validateChoices(options, {
      accessory: ['cap', 'zzz', 'mask', 'blanket', 'none'],
      body: ['round', 'pear', 'cloud'],
      mouth: ['smile', 'yawn', 'sleep'],
    }),
  render({ rng, palette, options }) {
    const accessory =
      options.accessory ?? rng.fork('accessory').pick(['cap', 'zzz', 'mask', 'blanket'] as const);
    const body = options.body ?? rng.fork('body').pick(['round', 'pear', 'cloud'] as const);
    const mouth = options.mouth ?? rng.fork('mouth').pick(['smile', 'yawn', 'sleep'] as const);
    const ink = readable(palette.primary, palette.ink);
    const accessoryInk = readable(palette.accent, palette.ink, palette.background);
    const eyes = rng
      .fork('eyes')
      .pick(['M26 39q4 5 8 0M46 39q4 5 8 0', 'M26 40h8M46 40h8', 'M26 38q4 5 8 1M46 39q4 4 8-1']);
    const face =
      (accessory === 'mask'
        ? ''
        : el('path', {
            d: eyes,
            fill: 'none',
            stroke: ink,
            'stroke-width': 2.6,
            'stroke-linecap': 'round',
          })) +
      (mouth === 'yawn'
        ? el('ellipse', { cx: 40, cy: 48, rx: 2.5, ry: 3.5, fill: ink })
        : el('path', {
            d: mouth === 'smile' ? 'M36 47q4 5 8 0' : 'M38 48h4',
            fill: 'none',
            stroke: ink,
            'stroke-width': 2.2,
            'stroke-linecap': 'round',
          }));
    const decoration =
      accessory === 'cap'
        ? el('path', {
            d: 'M22 27Q24 8 42 9Q51 8 60 24L49 20Q42 23 40 29Z',
            fill: palette.accent,
          }) +
          el('path', {
            d: 'M22 27Q31 21 40 29',
            fill: 'none',
            stroke: accessoryInk,
            'stroke-width': 2,
          }) +
          el('circle', { cx: 60, cy: 24, r: 4, fill: palette.background })
        : accessory === 'zzz'
          ? el('path', {
              d: 'M57 25h8l-8 8h8M62 15h6l-6 6h6M57 8h4l-4 4h4',
              fill: 'none',
              stroke: readable(palette.background, palette.ink),
              'stroke-width': 2.2,
              'stroke-linejoin': 'round',
            })
          : accessory === 'mask'
            ? el('rect', { x: 22, y: 33, width: 36, height: 14, rx: 7, fill: palette.accent }) +
              el('path', {
                d: 'M27 39q4 4 8 0M45 39q4 4 8 0',
                fill: 'none',
                stroke: accessoryInk,
                'stroke-width': 2.2,
                'stroke-linecap': 'round',
              })
            : accessory === 'blanket'
              ? el('path', { d: 'M13 51Q40 44 67 51L62 66Q40 75 18 66Z', fill: palette.accent }) +
                el('path', {
                  d: 'M16 54Q40 47 64 54M25 57l-2 8M54 57l3 8',
                  fill: 'none',
                  stroke: accessoryInk,
                  'stroke-width': 1.6,
                })
              : '';
    const shadow = el('ellipse', {
      cx: 40,
      cy: 68,
      rx: 25,
      ry: 4,
      fill: palette.secondary,
      opacity: 0.2,
    });
    const blush = rng.fork('blush').chance(0.6)
      ? el('path', {
          d: 'M24 45h6M50 45h6',
          stroke: palette.secondary,
          'stroke-width': 3.5,
          'stroke-linecap': 'round',
          opacity: 0.7,
        })
      : '';
    const character =
      el('path', { d: bodies[body], fill: palette.primary }) +
      el('ellipse', { cx: 40, cy: 56, rx: 15, ry: 9, fill: palette.secondary, opacity: 0.2 }) +
      blush +
      face +
      decoration;
    return (
      shadow +
      el('g', { transform: `translate(${svgNumber(rng.fork('pose').range(-2, 2))} 0)` }, character)
    );
  },
});

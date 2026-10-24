import { validateChoices } from '../../engine/collection.js';
import { readable } from '../../engine/color.js';
import { svgElement as el, svgNumber as n } from '../../engine/svg.js';
import type { Collection } from '../../types.js';
import { palettes } from './palettes.js';

export interface HelmetOptions {
  visor: 'round' | 'wide' | 'angular';
  reflection: 'ringed' | 'cratered' | 'crescent';
  antenna: 'none' | 'single' | 'double';
}

const visors = {
  round: 'M62 37a22 18 0 1 1-44 0a22 18 0 1 1 44 0Z',
  wide: 'M17 28Q40 17 63 28V43Q62 55 40 55T17 43Z',
  angular: 'M26 20H54L64 31L59 49L49 55H31L21 49L16 31Z',
};

export const helmet = Object.freeze<Collection<HelmetOptions>>({
  id: 'helmet',
  name: 'Casco',
  outputVersion: 1,
  palettes,
  usesInitials: false,
  validateOptions: (options) =>
    validateChoices(options, {
      visor: ['round', 'wide', 'angular'],
      reflection: ['ringed', 'cratered', 'crescent'],
      antenna: ['none', 'single', 'double'],
    }),
  render({ rng, palette, options, id }) {
    const visor = options.visor ?? rng.fork('visor').pick(['round', 'wide', 'angular'] as const);
    const reflection =
      options.reflection ??
      rng.fork('reflection').pick(['ringed', 'cratered', 'crescent'] as const);
    const antenna =
      options.antenna ?? rng.fork('antenna').pick(['none', 'single', 'double'] as const);
    const edge = readable(palette.background, palette.ink);
    const suitInk = readable(palette.primary, palette.ink);
    const light = readable(palette.secondary, palette.accent, palette.background);
    const clip = id('visor');
    const shift = rng.fork('reflection-position').range(-3, 3);
    const radius = rng.fork('reflection-size').range(8, 11);
    let planet = '';
    if (reflection === 'crescent') {
      planet = el('path', { d: 'M49 26A12 12 0 1 0 57 47A14 14 0 0 1 49 26Z', fill: light });
    } else {
      if (reflection === 'ringed')
        planet += el('ellipse', {
          cx: 46,
          cy: 39,
          rx: 16,
          ry: 5,
          transform: 'rotate(-24 46 39)',
          fill: 'none',
          stroke: light,
          'stroke-width': 2,
        });
      planet += el('circle', { cx: 46, cy: 39, r: radius, fill: light });
      if (reflection === 'ringed') {
        planet += el('path', {
          d: 'M30 39C30 46 62 46 62 39',
          fill: 'none',
          stroke: palette.secondary,
          'stroke-width': 2.5,
          transform: 'rotate(-24 46 39)',
        });
      } else {
        planet += el('path', {
          d: 'M43 34h1M49 42h1M40 42h1',
          stroke: readable(light, palette.secondary),
          'stroke-width': 3,
          'stroke-linecap': 'round',
        });
      }
    }
    const aerial =
      antenna === 'none'
        ? ''
        : (antenna === 'double' ? [12, 68] : [68])
            .map(
              (x) =>
                el('path', {
                  d: `M${x < 40 ? 18 : 62} 31V22L${x} 16`,
                  fill: 'none',
                  stroke: edge,
                  'stroke-width': 2.5,
                }) +
                el('circle', {
                  cx: x,
                  cy: 16,
                  r: 2.5,
                  fill: palette.accent,
                  stroke: edge,
                  'stroke-width': 1.5,
                }),
            )
            .join('');
    const shoulder = n(rng.fork('shoulder-width').range(13, 17));
    return (
      el('defs', {}, el('clipPath', { id: clip }, el('path', { d: visors[visor] }))) +
      el('path', {
        d: `M${shoulder} 76V68Q18 58 30 58H50Q62 58 ${n(80 - Number(shoulder))} 68V76Z`,
        fill: palette.primary,
        stroke: edge,
        'stroke-width': 2.5,
      }) +
      aerial +
      el('path', {
        d: 'M11 38C11 21 23 12 40 12S69 21 69 38V43Q68 62 40 64Q12 62 11 43Z',
        fill: palette.primary,
        stroke: edge,
        'stroke-width': 2.5,
      }) +
      el('path', {
        d: visors[visor],
        fill: palette.secondary,
        stroke: suitInk,
        'stroke-width': 3,
      }) +
      el(
        'g',
        { 'clip-path': `url(#${clip})` },
        el('g', { transform: `translate(${n(shift)} 0)` }, planet) +
          el('path', {
            d: 'M24 31Q29 23 40 25',
            fill: 'none',
            stroke: readable(palette.secondary, palette.background, palette.ink),
            'stroke-width': 3,
            opacity: 0.75,
            'stroke-linecap': 'round',
          }),
      ) +
      el('path', {
        d: 'M25 62H55V68H25ZM30 72H50',
        fill: palette.accent,
        stroke: suitInk,
        'stroke-width': 2.5,
        'stroke-linejoin': 'round',
      }) +
      el('path', {
        d: 'M16 39v7M64 39v7',
        stroke: suitInk,
        'stroke-width': 3,
        'stroke-linecap': 'round',
      })
    );
  },
});

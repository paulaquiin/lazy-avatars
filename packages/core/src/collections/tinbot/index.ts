import { validateChoices } from '../../engine/collection.js';
import { readable } from '../../engine/color.js';
import { svgElement as el, svgNumber as n } from '../../engine/svg.js';
import type { Collection } from '../../types.js';
import { palettes } from './palettes.js';

export interface TinbotOptions {
  antenna: 'single' | 'double' | 'dome';
  eyes: 'gauges' | 'visor' | 'mixed';
  mouth: 'grille' | 'smile' | 'dots';
}

export const tinbot = Object.freeze<Collection<TinbotOptions>>({
  id: 'tinbot',
  name: 'Hojalata',
  outputVersion: 1,
  palettes,
  usesInitials: false,
  validateOptions: (options) =>
    validateChoices(options, {
      antenna: ['single', 'double', 'dome'],
      eyes: ['gauges', 'visor', 'mixed'],
      mouth: ['grille', 'smile', 'dots'],
    }),
  render({ rng, palette, options }) {
    const antenna =
      options.antenna ?? rng.fork('antenna').pick(['single', 'double', 'dome'] as const);
    const eyes = options.eyes ?? rng.fork('eyes').pick(['gauges', 'visor', 'mixed'] as const);
    const mouth = options.mouth ?? rng.fork('mouth').pick(['grille', 'smile', 'dots'] as const);
    const edge = readable(palette.background, palette.ink);
    const ink = readable(palette.primary, palette.ink);
    const lens = palette.background;
    const lensInk = readable(lens, palette.ink);
    const gaze = n(rng.fork('gaze').range(-2, 2));
    const radius = rng.fork('head-corners').range(3, 9);
    const height = rng.fork('head-height').range(42, 46);
    let aerial = '';
    if (antenna === 'dome') {
      aerial =
        el('path', {
          d: 'M26 22a14 12 0 0 1 28 0Z',
          fill: palette.accent,
          stroke: edge,
          'stroke-width': 2.5,
        }) +
        el('path', {
          d: 'M33 18q3-5 8-5',
          fill: 'none',
          stroke: readable(palette.accent, palette.ink),
          'stroke-width': 2.5,
          'stroke-linecap': 'round',
        });
    } else {
      const positions = antenna === 'single' ? [40] : [29, 51];
      for (const x of positions) {
        const y = rng.fork(`antenna-height-${x}`).range(10, 15);
        aerial +=
          el('path', { d: `M${x} 23V${n(y)}`, stroke: edge, 'stroke-width': 3 }) +
          el('circle', {
            cx: x,
            cy: y,
            r: 3.5,
            fill: palette.accent,
            stroke: edge,
            'stroke-width': 2,
          });
      }
    }
    const gauge = (x: number) =>
      el('circle', { cx: x, cy: 39, r: 7, fill: lens, stroke: ink, 'stroke-width': 2.5 }) +
      el('path', {
        d: `M${x} 41l${gaze}-5`,
        stroke: lensInk,
        'stroke-width': 2.5,
        'stroke-linecap': 'round',
      });
    const eyeArt =
      eyes === 'visor'
        ? el('rect', {
            x: 22,
            y: 32,
            width: 36,
            height: 14,
            rx: 5,
            fill: lens,
            stroke: ink,
            'stroke-width': 2.5,
          }) +
          el('path', {
            d: `M${n(29 + Number(gaze))} 36v6M${n(49 + Number(gaze))} 36v6`,
            stroke: lensInk,
            'stroke-width': 3,
            'stroke-linecap': 'round',
          })
        : gauge(28) +
          (eyes === 'mixed'
            ? el('rect', {
                x: 46,
                y: 33,
                width: 13,
                height: 12,
                rx: 2,
                fill: lens,
                stroke: ink,
                'stroke-width': 2.5,
              }) + el('circle', { cx: 52 + Number(gaze), cy: 39, r: 2.5, fill: lensInk })
            : gauge(52));
    const mouthArt =
      mouth === 'grille'
        ? el('rect', {
            x: 28,
            y: 51,
            width: 24,
            height: 10,
            rx: 3,
            fill: palette.secondary,
            stroke: ink,
            'stroke-width': 2,
          }) +
          el('path', {
            d: 'M34 54v4M40 54v4M46 54v4',
            stroke: readable(palette.secondary, palette.background, palette.ink),
            'stroke-width': 2.5,
            'stroke-linecap': 'round',
          })
        : mouth === 'smile'
          ? el('path', {
              d: 'M29 53q11 12 22 0',
              fill: 'none',
              stroke: ink,
              'stroke-width': 3,
              'stroke-linecap': 'round',
            })
          : [32, 40, 48].map((cx) => el('circle', { cx, cy: 56, r: 2, fill: ink })).join('');
    const rivets = [
      [20, 27],
      [60, 27],
      [20, 61],
      [60, 61],
    ]
      .map(([cx, cy]) => el('circle', { cx, cy, r: 1.5, fill: ink }))
      .join('');
    return (
      aerial +
      el('path', {
        d: 'M15 34H9V49H15M65 34H71V49H65',
        fill: palette.secondary,
        stroke: edge,
        'stroke-width': 2.5,
        'stroke-linejoin': 'round',
      }) +
      el('rect', {
        x: 15,
        y: 22,
        width: 50,
        height,
        rx: radius,
        fill: palette.primary,
        stroke: edge,
        'stroke-width': 2.5,
      }) +
      el('path', {
        d: 'M23 28H54M19 34V48',
        fill: 'none',
        stroke: readable(palette.primary, palette.accent, palette.background),
        'stroke-width': 2.5,
        opacity: 0.65,
        'stroke-linecap': 'round',
      }) +
      eyeArt +
      mouthArt +
      rivets
    );
  },
});

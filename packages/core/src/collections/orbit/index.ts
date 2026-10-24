import { validateChoices } from '../../engine/collection.js';
import { readable } from '../../engine/color.js';
import { svgElement as el, svgNumber as n } from '../../engine/svg.js';
import type { Collection } from '../../types.js';
import { palettes } from './palettes.js';

export interface OrbitOptions {
  surface: 'bands' | 'craters';
  ring: 'none' | 'thin' | 'wide';
  moon: 'none' | 'small';
}

export const orbit = Object.freeze<Collection<OrbitOptions>>({
  id: 'orbit',
  name: 'Órbita',
  outputVersion: 1,
  palettes,
  usesInitials: false,
  validateOptions: (options) =>
    validateChoices(options, {
      surface: ['bands', 'craters'],
      ring: ['none', 'thin', 'wide'],
      moon: ['none', 'small'],
    }),
  render({ rng, palette, options, id }) {
    const surface = options.surface ?? rng.fork('surface').pick(['bands', 'craters'] as const);
    const ring = options.ring ?? rng.fork('ring').pick(['none', 'thin', 'wide'] as const);
    const moon = options.moon ?? rng.fork('moon').pick(['none', 'small'] as const);
    const radius = rng.fork('planet-size').range(20, 24);
    const tilt = n(rng.fork('ring-tilt').range(-30, 30));
    const edge = readable(palette.background, palette.primary, palette.ink);
    const detail = readable(palette.primary, palette.secondary, palette.ink);
    const ringColor = readable(palette.background, palette.accent, palette.ink);
    const ringWidth = ring === 'wide' ? 6 : 3;
    const clip = id('planet');
    const transform = `rotate(${tilt} 40 40)`;
    const backdrop =
      moon === 'small'
        ? el('circle', {
            cx: rng.fork('moon-x').range(60, 64),
            cy: rng.fork('moon-y').range(16, 20),
            r: rng.fork('moon-size').range(3, 4.2),
            fill: readable(palette.background, palette.accent, palette.ink),
          })
        : '';
    let surfaceArt = '';
    if (surface === 'bands') {
      const spacing = rng.fork('band-spacing').range(8, 11);
      surfaceArt = el('path', {
        d: [-1, 0, 1]
          .map(
            (i) => `M12 ${n(40 + i * spacing)}Q40 ${n(50 + i * spacing)} 68 ${n(40 + i * spacing)}`,
          )
          .join(''),
        fill: 'none',
        stroke: detail,
        'stroke-width': 3,
        opacity: 0.75,
      });
    } else {
      surfaceArt = Array.from({ length: rng.fork('crater-count').int(3, 5) }, (_, index) => {
        const r = rng.fork(`crater-${index}`);
        const angle = index * 2.4 + r.range(-0.2, 0.2);
        const distance = r.range(8, 16);
        const cx = 40 + Math.cos(angle) * distance;
        const cy = 40 + Math.sin(angle) * distance;
        const size = r.range(2.5, 4);
        return (
          el('circle', { cx, cy, r: size, fill: detail, opacity: 0.7 }) +
          el('path', {
            d: `M${n(cx - size + 1)} ${n(cy)}q0 ${n(-size + 1)} ${n(size - 1)} ${n(-size + 1)}`,
            fill: 'none',
            stroke: palette.primary,
            'stroke-width': 1.5,
          })
        );
      }).join('');
    }
    const body =
      el('circle', {
        cx: 40,
        cy: 40,
        r: radius,
        fill: palette.primary,
        stroke: edge,
        'stroke-width': 2.5,
      }) +
      el(
        'g',
        { 'clip-path': `url(#${clip})` },
        surfaceArt +
          el('path', {
            d: 'M43 10C32 35 46 61 67 62H80V8Z',
            fill: palette.secondary,
            opacity: 0.45,
          }) +
          el('ellipse', {
            cx: 31,
            cy: 30,
            rx: 7,
            ry: 11,
            fill: readable(palette.primary, palette.accent, palette.background),
            opacity: 0.2,
          }),
      );
    const backRing =
      ring === 'none'
        ? ''
        : el('ellipse', {
            cx: 40,
            cy: 40,
            rx: 33,
            ry: 11,
            fill: 'none',
            stroke: ringColor,
            'stroke-width': ringWidth,
            transform,
          });
    const frontRing =
      ring === 'none'
        ? ''
        : el('path', {
            d: 'M7 40C7 54.7 73 54.7 73 40',
            fill: 'none',
            stroke: ringColor,
            'stroke-width': ringWidth,
            'stroke-linecap': 'round',
            transform,
          });
    return (
      el('defs', {}, el('clipPath', { id: clip }, el('circle', { cx: 40, cy: 40, r: radius }))) +
      backdrop +
      backRing +
      body +
      frontRing
    );
  },
});

import { validateChoices } from '../../engine/collection.js';
import { readable } from '../../engine/color.js';
import { svgElement as el, svgNumber as n } from '../../engine/svg.js';
import type { Collection } from '../../types.js';
import { palettes } from './palettes.js';

export interface PantryOptions {
  food: 'donut' | 'citrus' | 'egg' | 'avocado';
}

export const pantry = Object.freeze<Collection<PantryOptions>>({
  id: 'pantry',
  name: 'Despensa',
  outputVersion: 1,
  palettes,
  usesInitials: false,
  validateOptions: (options) =>
    validateChoices(options, { food: ['donut', 'citrus', 'egg', 'avocado'] }),
  render({ rng, palette, options }) {
    const food =
      options.food ?? rng.fork('food').pick(['donut', 'citrus', 'egg', 'avocado'] as const);
    const edge = readable(palette.background, palette.primary, palette.ink);
    const ink = readable(palette.primary, palette.ink);
    const radius = n(rng.fork('radius').range(24, 27));
    let content = '';
    if (food === 'donut') {
      content =
        el('path', {
          d: `M40 ${n(40 - Number(radius))}a${radius} ${radius} 0 1 0 0 ${n(2 * Number(radius))}a${radius} ${radius} 0 1 0 0-${n(2 * Number(radius))}ZM40 32a8 8 0 1 1 0 16a8 8 0 1 1 0-16Z`,
          'fill-rule': 'evenodd',
          fill: palette.primary,
          stroke: edge,
          'stroke-width': 2.5,
        }) +
        el('path', {
          d: 'M40 17C50 15 51 23 59 24C68 26 61 36 64 43C66 51 55 50 52 58C48 67 39 58 32 61C22 65 25 54 18 50C11 44 22 36 18 30C15 22 28 26 31 20Q34 16 40 17ZM40 32a8 8 0 1 0 0 16a8 8 0 1 0 0-16Z',
          'fill-rule': 'evenodd',
          fill: palette.accent,
          stroke: readable(palette.accent, palette.ink),
          'stroke-width': 1.5,
        });
      const marks = Array.from({ length: 5 }, (_, index) => {
        const r = rng.fork(`sprinkle-${index}`);
        const angle = (index * Math.PI * 2) / 5 + r.range(-0.2, 0.2);
        const x = n(40 + 17 * Math.cos(angle));
        const y = n(40 + 17 * Math.sin(angle));
        return `M${x} ${y}l${n(r.range(-2, 2))} 3`;
      }).join('');
      content += el('path', {
        d: marks,
        fill: 'none',
        stroke: readable(palette.accent, palette.background, palette.ink),
        'stroke-width': 2.5,
        'stroke-linecap': 'round',
      });
    } else if (food === 'citrus') {
      content = el('circle', {
        cx: 40,
        cy: 40,
        r: radius,
        fill: palette.primary,
        stroke: edge,
        'stroke-width': 2.5,
      });
      const count = rng.fork('segments').int(6, 9);
      const rotation = rng.fork('rotation').range(0, Math.PI);
      const flesh = palette.secondary;
      for (let i = 0; i < count; i++) {
        const a = rotation + (i * Math.PI * 2) / count + 0.08;
        const b = rotation + ((i + 1) * Math.PI * 2) / count - 0.08;
        content += el('path', {
          d: `M${n(40 + 5 * Math.cos((a + b) / 2))} ${n(40 + 5 * Math.sin((a + b) / 2))}L${n(40 + 21 * Math.cos(a))} ${n(40 + 21 * Math.sin(a))}A21 21 0 0 1 ${n(40 + 21 * Math.cos(b))} ${n(40 + 21 * Math.sin(b))}Z`,
          fill: flesh,
          stroke: readable(flesh, palette.ink),
          'stroke-width': 1.5,
        });
      }
      content += el('circle', { cx: 40, cy: 40, r: 2.5, fill: palette.accent });
    } else if (food === 'egg') {
      const x = n(rng.fork('yolk-x').range(34, 46));
      const y = n(rng.fork('yolk-y').range(36, 44));
      const white = readable(palette.background, palette.secondary, palette.ink);
      content =
        el('path', {
          d: 'M15 38C8 24 22 12 34 17C42 7 60 14 60 25C75 30 73 46 63 51C68 66 51 73 41 64C27 75 11 61 17 51C8 48 9 41 15 38Z',
          fill: palette.secondary,
          stroke: white,
          'stroke-width': 2.5,
        }) +
        el('circle', {
          cx: x,
          cy: y,
          r: rng.fork('yolk-size').range(11, 14),
          fill: palette.accent,
          stroke: readable(palette.secondary, palette.accent, palette.ink),
          'stroke-width': 2.5,
        }) +
        el('path', {
          d: `M${n(Number(x) - 5)} ${n(Number(y) - 4)}q3-4 7-2`,
          fill: 'none',
          stroke: readable(palette.accent, palette.secondary, palette.ink),
          'stroke-width': 2.5,
          'stroke-linecap': 'round',
        });
    } else {
      const pitY = n(rng.fork('pit-y').range(43, 49));
      content =
        el('path', {
          d: 'M40 11C28 11 29 25 19 39C7 57 20 70 40 70S73 57 61 39C51 25 52 11 40 11Z',
          fill: palette.primary,
          stroke: edge,
          'stroke-width': 2.5,
        }) +
        el('path', {
          d: 'M40 18C32 18 33 30 25 41C15 55 25 64 40 64S65 55 55 41C47 30 48 18 40 18Z',
          fill: palette.secondary,
        }) +
        el('circle', {
          cx: 40,
          cy: pitY,
          r: rng.fork('pit-size').range(10, 13),
          fill: palette.accent,
          stroke: readable(palette.secondary, palette.accent, palette.ink),
          'stroke-width': 2.5,
        }) +
        el('path', {
          d: `M36 ${n(Number(pitY) - 5)}q-4 4-2 8`,
          fill: 'none',
          stroke: readable(palette.accent, ink, palette.background),
          'stroke-width': 2.5,
          'stroke-linecap': 'round',
        });
    }
    return el('g', { transform: `rotate(${n(rng.fork('tilt').range(-12, 12))} 40 40)` }, content);
  },
});

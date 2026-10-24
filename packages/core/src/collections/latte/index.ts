import { validateChoices } from '../../engine/collection.js';
import { readable } from '../../engine/color.js';
import { svgElement as el, svgNumber as n } from '../../engine/svg.js';
import type { Collection } from '../../types.js';
import { palettes } from './palettes.js';

export interface LatteOptions {
  art: 'heart' | 'tulip' | 'rosetta' | 'rings';
}

export const latte = Object.freeze<Collection<LatteOptions>>({
  id: 'latte',
  name: 'Latte',
  outputVersion: 1,
  palettes,
  usesInitials: false,
  validateOptions: (options) =>
    validateChoices(options, { art: ['heart', 'tulip', 'rosetta', 'rings'] }),
  render({ rng, palette, options }) {
    const art =
      options.art ?? rng.fork('art').pick(['heart', 'tulip', 'rosetta', 'rings'] as const);
    const edge = readable(palette.background, palette.ink);
    const foam = readable(palette.secondary, palette.accent, palette.background);
    const cupEdge = readable(palette.primary, palette.ink);
    const spread = n(rng.fork('spread').range(11, 15));
    let drawing = '';
    if (art === 'heart') {
      drawing = el('path', {
        d: `M38 53C24 43 18 35 25 30Q32 24 38 33Q44 24 51 30C58 35 52 43 38 53Z`,
        fill: foam,
      });
      drawing += el('path', {
        d: 'M38 37V48',
        stroke: palette.secondary,
        'stroke-width': 2.5,
        'stroke-linecap': 'round',
      });
    } else if (art === 'tulip') {
      const petals = rng.fork('petals').int(3, 4);
      for (let i = 0; i < petals; i++) {
        const y = 28 + i * 6;
        const w = Number(spread) - i * 2.4;
        drawing += el('path', {
          d: `M38 ${y + 7}C${n(38 - w * 2)} ${y - 3} ${n(38 - w)} ${y - 7} 38 ${y + 1}C${n(38 + w)} ${y - 7} ${n(38 + w * 2)} ${y - 3} 38 ${y + 7}Z`,
          fill: foam,
        });
      }
      drawing += el('path', {
        d: 'M38 31V54',
        fill: 'none',
        stroke: foam,
        'stroke-width': 2.5,
        'stroke-linecap': 'round',
      });
    } else if (art === 'rosetta') {
      const leaves = rng.fork('leaves').int(4, 5);
      for (let i = 0; i < leaves; i++) {
        const y = 27 + i * 5;
        const w = Number(spread) - i * 1.8;
        drawing += el('path', {
          d: `M38 ${y + 5}Q${n(38 - w * 1.7)} ${y - 7} ${n(38 - w)} ${y + 1}Q${n(38 - w / 2)} ${y + 7} 38 ${y + 5}Q${n(38 + w / 2)} ${y + 7} ${n(38 + w)} ${y + 1}Q${n(38 + w * 1.7)} ${y - 7} 38 ${y + 5}Z`,
          fill: foam,
        });
      }
      drawing += el('path', {
        d: 'M38 26V55',
        fill: 'none',
        stroke: foam,
        'stroke-width': 2.5,
        'stroke-linecap': 'round',
      });
    } else {
      for (const radius of [6, 12, 18]) {
        drawing += el('circle', {
          cx: 38,
          cy: 40,
          r: radius,
          fill: 'none',
          stroke: foam,
          'stroke-width': 2.5,
        });
      }
      drawing += el('circle', { cx: 38, cy: 40, r: 2, fill: foam });
    }
    const handleAngle = n(rng.fork('handle-angle').range(-30, 30));
    const cup =
      el('path', {
        d: 'M59 31H65C78 31 78 49 65 49H59V43H65C70 43 70 37 65 37H59Z',
        fill: palette.primary,
        stroke: edge,
        'stroke-width': 2.5,
        'stroke-linejoin': 'round',
      }) +
      el('circle', {
        cx: 38,
        cy: 40,
        r: 28,
        fill: palette.primary,
        stroke: edge,
        'stroke-width': 2.5,
      }) +
      el('circle', {
        cx: 38,
        cy: 40,
        r: 23,
        fill: palette.secondary,
        stroke: cupEdge,
        'stroke-width': 2.5,
      }) +
      drawing;
    return el('g', { transform: `rotate(${handleAngle} 38 40)` }, cup);
  },
});

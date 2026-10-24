import { validateChoices } from '../../engine/collection.js';
import { readable } from '../../engine/color.js';
import { svgElement as el, svgNumber as n } from '../../engine/svg.js';
import type { Collection } from '../../types.js';
import { palettes } from './palettes.js';

export interface DecoOptions {
  motif: 'fan' | 'arches' | 'sun';
}

export const deco = Object.freeze<Collection<DecoOptions>>({
  id: 'deco',
  name: 'Déco',
  outputVersion: 1,
  palettes,
  usesInitials: false,
  validateOptions: (options) => validateChoices(options, { motif: ['fan', 'arches', 'sun'] }),
  render({ rng, palette, options }) {
    const motif = options.motif ?? rng.fork('motif').pick(['fan', 'arches', 'sun'] as const);
    const gold = readable(palette.background, palette.primary, palette.ink);
    const accent = readable(palette.background, palette.accent, palette.ink);
    const width = n(rng.fork('width').range(23, 27));
    const frame = el('path', {
      d: 'M22 8H58L72 22V58L58 72H22L8 58V22ZM25 13H55M25 67H55',
      fill: 'none',
      stroke: gold,
      'stroke-width': 2.5,
      'stroke-linejoin': 'round',
    });
    let d = '';
    if (motif === 'fan') {
      const ribs = rng.fork('ribs').int(4, 6);
      const top = n(rng.fork('height').range(17, 22));
      for (let i = -ribs; i <= ribs; i++) {
        const angle = ((i / ribs) * Math.PI) / 2.8;
        d += `M40 61L${n(40 + Number(width) * Math.sin(angle))} ${n(61 - (61 - Number(top)) * Math.cos(angle))}`;
      }
      d += `M${n(40 - Number(width) * Math.sin(Math.PI / 2.8))} ${n(61 - (61 - Number(top)) * Math.cos(Math.PI / 2.8))}Q40 ${n(Number(top) - 12)} ${n(40 + Number(width) * Math.sin(Math.PI / 2.8))} ${n(61 - (61 - Number(top)) * Math.cos(Math.PI / 2.8))}`;
    } else if (motif === 'arches') {
      const levels = rng.fork('levels').int(3, 5);
      for (let i = 0; i < levels; i++) {
        const w = Number(width) - i * 5;
        const y = 20 + i * 6;
        d += `M${n(40 - w)} 60V${y + 10}L${n(40 - w + 9)} ${y}H${n(40 + w - 9)}L${n(40 + w)} ${y + 10}V60`;
      }
    } else {
      const rays = rng.fork('rays').int(9, 13);
      const inner = rng.fork('inner-radius').range(9, 12);
      for (let i = 0; i < rays; i++) {
        const a = Math.PI + (i * Math.PI) / (rays - 1);
        d += `M${n(40 + inner * Math.cos(a))} ${n(49 + inner * Math.sin(a))}L${n(40 + Number(width) * Math.cos(a))} ${n(49 + Number(width) * Math.sin(a))}`;
      }
      d += `M${n(40 - inner)} 49A${n(inner)} ${n(inner)} 0 0 1 ${n(40 + inner)} 49M16 55H64M23 61H57`;
    }
    return (
      frame +
      el('path', {
        d,
        fill: 'none',
        stroke: gold,
        'stroke-width': 2.5,
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
      }) +
      el('path', { d: 'M40 65l3 3-3 3-3-3ZM9 38l3 2-3 2-3-2ZM71 38l3 2-3 2-3-2Z', fill: accent })
    );
  },
});

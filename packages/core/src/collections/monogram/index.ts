import { validateChoices } from '../../engine/collection.js';
import { readable } from '../../engine/color.js';
import { renderSerifInitials } from '../../engine/serif.js';
import { svgElement as el } from '../../engine/svg.js';
import type { Collection } from '../../types.js';
import { palettes } from './palettes.js';

export interface MonogramOptions {
  frame: 'circle' | 'shield' | 'diamond';
}

export const monogram = Object.freeze<Collection<MonogramOptions>>({
  id: 'monogram',
  name: 'Monograma',
  outputVersion: 1,
  palettes,
  usesInitials: true,
  validateOptions: (options) =>
    validateChoices(options, { frame: ['circle', 'shield', 'diamond'] }),
  render({ rng, initials, palette, options }) {
    const frame = options.frame ?? rng.fork('frame').pick(['circle', 'shield', 'diamond'] as const);
    const line = readable(palette.primary, palette.accent, palette.background, palette.ink);
    const ink = readable(palette.primary, palette.ink, palette.background);
    const seal =
      frame === 'circle'
        ? el('circle', { cx: 40, cy: 40, r: 34, fill: palette.primary }) +
          el('circle', { cx: 40, cy: 40, r: 29, fill: 'none', stroke: line, 'stroke-width': 1.8 })
        : frame === 'shield'
          ? el('path', { d: 'M9 10H71V42Q70 65 40 75Q10 65 9 42Z', fill: palette.primary }) +
            el('path', {
              d: 'M15 16H65V42Q64 60 40 68Q16 60 15 42Z',
              fill: 'none',
              stroke: line,
              'stroke-width': 1.8,
            })
          : el('path', { d: 'M40 3 77 40 40 77 3 40Z', fill: palette.primary }) +
            el('path', {
              d: 'M40 10 70 40 40 70 10 40Z',
              fill: 'none',
              stroke: line,
              'stroke-width': 1.8,
            });
    return seal + renderSerifInitials(initials, ink);
  },
});

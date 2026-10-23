import { validateChoices } from '../../engine/collection.js';
import { readable } from '../../engine/color.js';
import { svgElement as el } from '../../engine/svg.js';
import type { Collection } from '../../types.js';
import { palettes } from './palettes.js';

export interface MosaicOptions {
  tile: 'arcs' | 'triangles';
}

export const mosaic = Object.freeze<Collection<MosaicOptions>>({
  id: 'mosaic',
  name: 'Mosaico',
  outputVersion: 1,
  palettes,
  usesInitials: false,
  validateOptions: (options) => validateChoices(options, { tile: ['arcs', 'triangles'] }),
  render({ rng, palette, options }) {
    const tile = options.tile ?? rng.fork('tile-kind').pick(['arcs', 'triangles'] as const);
    const foreground = readable(
      palette.primary,
      palette.secondary,
      palette.ink,
      palette.background,
    );
    const tiles = Array.from({ length: 16 }, (_, index) => {
      const rotation = rng.fork(`tile-${index}`).int(0, 3) * 90;
      const drawing =
        tile === 'triangles'
          ? el('path', { d: 'M0 0H20V20Z', fill: foreground })
          : el('path', {
              d: 'M0 10A10 10 0 0 1 10 0M10 20A10 10 0 0 1 20 10',
              fill: 'none',
              stroke: foreground,
              'stroke-width': 4,
            });
      return el(
        'g',
        {
          transform: `translate(${(index % 4) * 20} ${Math.floor(index / 4) * 20}) rotate(${rotation} 10 10)`,
        },
        drawing,
      );
    }).join('');
    return el('rect', { width: 80, height: 80, fill: palette.primary }) + tiles;
  },
});

import { validateChoices } from '../../engine/collection.js';
import { readable } from '../../engine/color.js';
import { svgElement as el, svgNumber as n } from '../../engine/svg.js';
import type { Collection } from '../../types.js';
import { palettes } from './palettes.js';

export const constellation = Object.freeze<Collection<object>>({
  id: 'constellation',
  name: 'Constelación',
  outputVersion: 1,
  palettes,
  usesInitials: false,
  validateOptions: (options) => validateChoices(options, {}),
  render({ rng, palette }) {
    const count = rng.fork('star-count').int(4, 6);
    const line = readable(palette.background, palette.primary, palette.ink);
    const bright = readable(palette.background, palette.accent, palette.ink);
    const start = rng.fork('rotation').range(-Math.PI / 2, 0);
    // Ordered angular sectors avoid intersections; bounded radii separate stars.
    const points = Array.from({ length: count }, (_, index) => {
      const stream = rng.fork(`star-${index}`);
      const angle = start + (index * Math.PI * 2) / count + stream.range(-0.13, 0.13);
      const radius = stream.range(20, 28);
      return {
        x: Number(n(40 + Math.cos(angle) * radius)),
        y: Number(n(40 + Math.sin(angle) * radius)),
      };
    });
    const close = rng.fork('closed').chance(0.45);
    const d =
      points.map((point, index) => `${index === 0 ? 'M' : 'L'}${point.x} ${point.y}`).join('') +
      (close ? 'Z' : '');
    const dust = Array.from({ length: 7 }, (_, index) => {
      const stream = rng.fork(`background-star-${index}`);
      const angle = (index * Math.PI * 2) / 7 + stream.range(-0.1, 0.1);
      // Separate outer ring keeps background specks away from the main graph.
      return el('circle', {
        cx: 40 + 34 * Math.cos(angle),
        cy: 40 + 34 * Math.sin(angle),
        r: stream.range(0.7, 1.1),
        fill: line,
        opacity: 0.45,
      });
    }).join('');
    const stars = points
      .map((point, index) =>
        index === 0
          ? el('path', {
              d: `M${point.x} ${n(point.y - 4.5)}L${n(point.x + 1.5)} ${n(point.y - 1.5)}L${n(point.x + 4.5)} ${point.y}L${n(point.x + 1.5)} ${n(point.y + 1.5)}L${point.x} ${n(point.y + 4.5)}L${n(point.x - 1.5)} ${n(point.y + 1.5)}L${n(point.x - 4.5)} ${point.y}L${n(point.x - 1.5)} ${n(point.y - 1.5)}Z`,
              fill: bright,
            })
          : el('circle', {
              cx: point.x,
              cy: point.y,
              r: rng.fork(`size-${index}`).range(2.4, 3.1),
              fill: line,
            }),
      )
      .join('');
    return (
      dust +
      el('path', {
        d,
        fill: 'none',
        stroke: line,
        'stroke-width': 2.5,
        'stroke-linejoin': 'round',
        'stroke-linecap': 'round',
      }) +
      stars
    );
  },
});

import { validateChoices } from '../../engine/collection.js';
import { readable } from '../../engine/color.js';
import { svgElement as el, svgNumber as n } from '../../engine/svg.js';
import type { Collection } from '../../types.js';
import { palettes } from './palettes.js';

export interface OrigamiOptions {
  animal: 'fox' | 'cat' | 'bear' | 'owl';
}

export const origami = Object.freeze<Collection<OrigamiOptions>>({
  id: 'origami',
  name: 'Origami',
  outputVersion: 1,
  palettes,
  usesInitials: false,
  validateOptions: (options) => validateChoices(options, { animal: ['fox', 'cat', 'bear', 'owl'] }),
  render({ rng, palette, options }) {
    const animal =
      options.animal ?? rng.fork('animal').pick(['fox', 'cat', 'bear', 'owl'] as const);
    const jaw = n(rng.fork('jaw').range(58, 66));
    const brow = n(rng.fork('brow').range(27, 31));
    const fold = n(rng.fork('fold').range(36, 44));
    const outlines = {
      fox: `M12 14L30 ${brow}H50L68 14L63 48L40 ${jaw}L17 48Z`,
      cat: `M15 15L31 ${brow}H49L65 15L64 52L51 ${jaw}H29L16 52Z`,
      bear: `M14 19L24 15L32 ${brow}H48L56 15L66 19L65 32L60 35L63 51L52 ${jaw}H28L17 51L20 35L15 32Z`,
      owl: `M14 20L29 ${brow}H51L66 20L62 51L40 ${jaw}L18 51Z`,
    };
    const ink = readable(palette.primary, palette.ink);
    const edge = readable(palette.background, palette.primary, palette.ink);
    const cheek = palette.accent;
    const eyeInk = animal === 'owl' ? readable(cheek, palette.ink) : ink;
    const eyes =
      animal === 'owl'
        ? el('path', { d: 'M21 34L36 36L33 49L20 44ZM44 36L59 34L60 44L47 49Z', fill: cheek }) +
          el('path', {
            d: 'M27 39v4M53 39v4',
            stroke: eyeInk,
            'stroke-width': 3,
            'stroke-linecap': 'round',
          })
        : el('path', {
            d: animal === 'fox' ? 'M24 39l7 3M49 42l7-3' : 'M26 40h3M51 40h3',
            stroke: ink,
            'stroke-width': 3,
            'stroke-linecap': 'round',
          });
    return (
      el('path', {
        d: outlines[animal],
        fill: palette.primary,
        stroke: edge,
        'stroke-width': 2.5,
        'stroke-linejoin': 'round',
      }) +
      el('path', {
        d: `M40 ${brow}L${fold} 48L40 ${jaw}L61 49L63 32Z`,
        fill: palette.secondary,
        opacity: 0.65,
      }) +
      (animal === 'fox' || animal === 'cat'
        ? el('path', {
            d: `M18 23L27 ${brow}L20 34ZM62 23L53 ${brow}L60 34Z`,
            fill: palette.accent,
          })
        : '') +
      el('path', { d: `M18 47L${fold} 48L40 ${jaw}Z`, fill: cheek, opacity: 0.8 }) +
      eyes +
      el('path', { d: animal === 'owl' ? 'M36 47H44L40 54Z' : 'M36 48H44L40 53Z', fill: ink }) +
      el('path', {
        d: `M40 ${brow}L${fold} 45`,
        fill: 'none',
        stroke: ink,
        'stroke-width': 1.5,
        opacity: 0.35,
      })
    );
  },
});

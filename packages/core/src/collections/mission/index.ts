import { validateChoices } from '../../engine/collection.js';
import { readable } from '../../engine/color.js';
import { svgElement as el, svgNumber as n } from '../../engine/svg.js';
import type { Collection } from '../../types.js';
import { renderMissionInitials } from './glyphs.js';
import { palettes } from './palettes.js';

export interface MissionOptions {
  badge: 'shield' | 'round' | 'hexagon';
  planet: 'striped' | 'ringed' | 'cratered';
  rocket: 'upright' | 'tilted';
}

const badges = {
  shield: 'M12 12H68V39Q68 60 40 72Q12 60 12 39Z',
  round: 'M40 7a32 32 0 1 1 0 64a32 32 0 1 1 0-64Z',
  hexagon: 'M40 6L68 22V55L40 72L12 55V22Z',
};

export const mission = Object.freeze<Collection<MissionOptions>>({
  id: 'mission',
  name: 'Misión',
  outputVersion: 1,
  palettes,
  usesInitials: true,
  validateOptions: (options) =>
    validateChoices(options, {
      badge: ['shield', 'round', 'hexagon'],
      planet: ['striped', 'ringed', 'cratered'],
      rocket: ['upright', 'tilted'],
    }),
  render({ rng, palette, options, initials, id }) {
    const badge = options.badge ?? rng.fork('badge').pick(['shield', 'round', 'hexagon'] as const);
    const planet =
      options.planet ?? rng.fork('planet').pick(['striped', 'ringed', 'cratered'] as const);
    const rocket = options.rocket ?? rng.fork('rocket').pick(['upright', 'tilted'] as const);
    const edge = readable(palette.background, palette.primary, palette.ink);
    const field = palette.secondary;
    const fieldInk = readable(field, palette.primary, palette.ink);
    const rocketInk = readable(palette.background, palette.ink);
    const planetColor = readable(field, palette.primary, palette.ink);
    const radius = rng.fork('planet-size').range(13, 16);
    const clip = id('badge');
    const stars = Array.from({ length: rng.fork('stars').int(3, 5) }, (_, index) => {
      const stream = rng.fork(`star-${index}`);
      return el('circle', {
        cx: stream.range(21, 59),
        cy: stream.range(19, 34),
        r: stream.range(1.3, 2),
        fill: fieldInk,
      });
    }).join('');
    let planetArt = el('circle', { cx: 38, cy: 53, r: radius, fill: planetColor });
    const marks = readable(planetColor, palette.accent, palette.background);
    if (planet === 'striped')
      planetArt += el('path', {
        d: 'M25 47Q38 53 51 47M24 54Q38 60 52 54',
        fill: 'none',
        stroke: marks,
        'stroke-width': 2.5,
      });
    else if (planet === 'cratered')
      planetArt += el('path', {
        d: 'M32 46h1M43 51h1M29 55h1',
        stroke: marks,
        'stroke-width': 4,
        'stroke-linecap': 'round',
      });
    else
      planetArt += el('ellipse', {
        cx: 38,
        cy: 53,
        rx: 22,
        ry: 6,
        fill: 'none',
        stroke: marks,
        'stroke-width': 2.5,
        transform: 'rotate(-20 38 53)',
      });
    const tilt = rocket === 'upright' ? 0 : rng.fork('rocket-tilt').range(24, 38);
    const rocketArt = el(
      'g',
      { transform: `rotate(${n(tilt)} 44 33)` },
      el('path', {
        d: 'M39 36L35 42V33L39 29M49 36L53 42V33L49 29',
        fill: palette.accent,
        stroke: fieldInk,
        'stroke-width': 2,
        'stroke-linejoin': 'round',
      }) +
        el('path', {
          d: 'M39 36V28Q40 22 44 19Q48 22 49 28V36Z',
          fill: palette.background,
          stroke: rocketInk,
          'stroke-width': 2.5,
          'stroke-linejoin': 'round',
        }) +
        el('circle', { cx: 44, cy: 28, r: 2, fill: rocketInk }) +
        el('path', {
          d: 'M41 38L44 45L47 38Z',
          fill: palette.accent,
          stroke: fieldInk,
          'stroke-width': 1.5,
        }),
    );
    return (
      el('defs', {}, el('clipPath', { id: clip }, el('path', { d: badges[badge] }))) +
      el('path', {
        d: badges[badge],
        fill: field,
        stroke: edge,
        'stroke-width': 5,
        'stroke-linejoin': 'round',
      }) +
      el(
        'g',
        { 'clip-path': `url(#${clip})` },
        stars +
          planetArt +
          el('ellipse', {
            cx: 40,
            cy: 39,
            rx: 25,
            ry: 9,
            fill: 'none',
            stroke: fieldInk,
            'stroke-width': 2,
            transform: 'rotate(-30 40 39)',
          }) +
          rocketArt,
      ) +
      el('path', {
        d: badges[badge],
        fill: 'none',
        stroke: edge,
        'stroke-width': 4,
        'stroke-linejoin': 'round',
      }) +
      el('path', {
        d: 'M13 53H67V69H13L17 61Z',
        fill: palette.accent,
        stroke: fieldInk,
        'stroke-width': 2.5,
        'stroke-linejoin': 'round',
      }) +
      renderMissionInitials(initials, readable(palette.accent, palette.ink))
    );
  },
});

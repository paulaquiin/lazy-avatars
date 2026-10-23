import { validateChoices } from '../../engine/collection.js';
import { readable } from '../../engine/color.js';
import { renderPixelPath } from '../../engine/glyphs.js';
import { svgElement as el } from '../../engine/svg.js';
import type { Collection } from '../../types.js';
import { palettes } from './palettes.js';

export interface RackOptions {
  status: 'ok' | 'warn' | 'down' | 'off';
  unit: 'disks' | 'vent';
}
export const statusColors = Object.freeze({
  ok: '#5cdd85',
  warn: '#f5b942',
  down: '#f35d63',
  off: '#69717a',
});

export const rack = Object.freeze<Collection<RackOptions>>({
  id: 'rack',
  name: 'Rack',
  outputVersion: 1,
  palettes,
  usesInitials: true,
  validateOptions: (options) =>
    validateChoices(options, { status: ['ok', 'warn', 'down', 'off'], unit: ['disks', 'vent'] }),
  render({ rng, initials, palette, options }) {
    const ink = readable(palette.primary, palette.ink, palette.background);
    const light = statusColors[options.status ?? 'off'];
    const chassis = el('rect', {
      x: 6,
      y: 7,
      width: 68,
      height: 66,
      rx: 5,
      fill: palette.secondary,
    });
    const screws = [12, 68]
      .flatMap((x) =>
        [12, 68].map((y) =>
          el('circle', {
            cx: x,
            cy: y,
            r: 1.5,
            fill: readable(palette.secondary, palette.accent, palette.ink),
          }),
        ),
      )
      .join('');
    const units = [0, 1, 2]
      .map((index) => {
        const y = 14 + index * 18;
        const unit = options.unit ?? rng.fork(`unit-${index}`).pick(['disks', 'vent'] as const);
        const panel = el('rect', { x: 15, y, width: 50, height: 15, rx: 2, fill: palette.primary });
        const details =
          index === 0
            ? el('rect', { x: 21, y: y + 2, width: 28, height: 11, rx: 1, fill: '#c9dea8' }) +
              renderPixelPath(
                initials,
                initials.length === 1 ? 32.6 : 29.4,
                y + 3.5,
                1.6,
                '#243b22',
              )
            : unit === 'disks'
              ? el('path', {
                  d: `M20 ${y + 4}h14v7H20ZM39 ${y + 4}h14v7H39Z`,
                  fill: 'none',
                  stroke: ink,
                  'stroke-width': 1.5,
                })
              : el('path', {
                  d: Array.from({ length: 7 }, (_, slot) => `M${21 + slot * 5} ${y + 4}v7`).join(
                    '',
                  ),
                  fill: 'none',
                  stroke: ink,
                  'stroke-width': 1.6,
                });
        return (
          panel +
          details +
          el('circle', { cx: 59, cy: y + 7.5, r: 2.5, fill: light }) +
          el('circle', {
            cx: 59,
            cy: y + 7.5,
            r: 3.5,
            fill: 'none',
            stroke: '#111820',
            'stroke-width': 1,
          })
        );
      })
      .join('');
    return chassis + screws + units;
  },
});

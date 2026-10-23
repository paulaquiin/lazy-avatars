import type { Collection } from '../packages/core/src/index.js';
import { readable, renderPixelGlyphs, svgElement, themes } from '../packages/core/src/index.js';

export interface TestOptions {
  variant: 'disc' | 'diamond';
  initials: boolean;
}

/** Development fixture only: deliberately outside the published package. */
export const testCollection = Object.freeze<Collection<TestOptions>>({
  id: 'test',
  name: 'Engine test fixture',
  outputVersion: 1,
  palettes: themes.pastel,
  usesInitials: true,
  validateOptions(options) {
    if (Object.keys(options).some((key) => !['variant', 'initials'].includes(key))) {
      throw new TypeError('Unknown test collection option');
    }
    if (options.variant !== undefined && !['disc', 'diamond'].includes(options.variant)) {
      throw new TypeError('Invalid test variant');
    }
    if (options.initials !== undefined && typeof options.initials !== 'boolean') {
      throw new TypeError('initials must be boolean');
    }
  },
  render({ rng, palette, initials, options }) {
    const variant = options.variant ?? rng.fork('variant').pick(['disc', 'diamond'] as const);
    const radius = rng.fork('geometry').int(22, 28);
    const body =
      variant === 'disc'
        ? svgElement('circle', { cx: 40, cy: 40, r: radius, fill: palette.primary })
        : svgElement('path', { d: 'M40 10 70 40 40 70 10 40Z', fill: palette.primary });
    const label =
      options.initials === false
        ? ''
        : renderPixelGlyphs(
            initials,
            initials.length === 1 ? 35.5 : 29.5,
            32.5,
            3,
            readable(palette.primary, palette.ink),
          );
    return body + label;
  },
});

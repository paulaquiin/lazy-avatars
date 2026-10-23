export { createAvatar, createAvatarDataUri } from './engine/avatar.js';
export { contrastRatio, normalizeColor, readable } from './engine/color.js';
export { renderPixelGlyphs } from './engine/glyphs.js';
export { hashString, normalizeSeed } from './engine/hash.js';
export { extractInitials } from './engine/initials.js';
export { createRng, type Rng } from './engine/rng.js';
export { escapeXml, svgElement, svgNumber } from './engine/svg.js';
export { themes } from './themes/index.js';
export type {
  AvatarOptions,
  Collection,
  Palette,
  PaletteInput,
  RenderContext,
  Shape,
  ThemeId,
} from './types.js';

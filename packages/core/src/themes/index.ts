import { normalizePalette } from '../engine/color.js';
import type { Palette, ThemeId } from '../types.js';

function palette(
  background: string,
  primary: string,
  secondary: string,
  accent: string,
  ink: string,
): Palette {
  return normalizePalette({ background, primary, secondary, accent, ink });
}

export const themes: Readonly<Record<ThemeId, readonly Palette[]>> = Object.freeze({
  pastel: Object.freeze([
    palette('#f4eee8', '#b6c8bc', '#879d98', '#e9b5a3', '#273b38'),
    palette('#f0ebf5', '#bcb1da', '#8b7da8', '#eac5a9', '#322e44'),
  ]),
  corporate: Object.freeze([palette('#edf1f5', '#274560', '#152e45', '#b99752', '#102437')]),
  night: Object.freeze([palette('#141b2d', '#829ee0', '#526caa', '#f3c86b', '#f2f4ff')]),
  earth: Object.freeze([palette('#eee4d3', '#8d684e', '#614a3b', '#bd794d', '#30271e')]),
  mono: Object.freeze([palette('#f1f1f1', '#737373', '#454545', '#aaaaaa', '#171717')]),
});

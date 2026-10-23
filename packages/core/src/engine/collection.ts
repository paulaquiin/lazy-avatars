import type { Palette } from '../types.js';

export function definePalette(
  background: string,
  primary: string,
  secondary: string,
  accent: string,
  ink: string,
): Palette {
  return Object.freeze({ background, primary, secondary, accent, ink });
}

export function validateChoices(
  options: object,
  choices: Readonly<Record<string, readonly string[]>>,
): void {
  for (const [key, value] of Object.entries(options)) {
    if (
      !Object.hasOwn(choices, key) ||
      typeof value !== 'string' ||
      !choices[key]?.includes(value)
    ) {
      throw new TypeError(`Invalid collection option: ${key}`);
    }
  }
}

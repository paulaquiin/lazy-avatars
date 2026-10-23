import type { Rng } from './engine/rng.js';

export interface Palette {
  readonly background: string;
  readonly primary: string;
  readonly secondary: string;
  readonly accent: string;
  readonly ink: string;
}

export type ThemeId = 'pastel' | 'corporate' | 'night' | 'earth' | 'mono';
export type PaletteInput = ThemeId | Palette | readonly Palette[];
export type Shape = 'square' | 'rounded' | 'circle';

export interface RenderContext<O extends object = Record<string, never>> {
  readonly rng: Rng;
  readonly seed: string;
  readonly initials: string;
  readonly palette: Palette;
  readonly options: Readonly<Partial<O>>;
  readonly id: (name: string) => string;
}

/** Collection code is trusted application code, not an untrusted SVG template. */
export interface Collection<O extends object = Record<string, never>> {
  readonly id: string;
  readonly name: string;
  readonly outputVersion: number;
  readonly palettes: readonly Palette[];
  readonly usesInitials: boolean;
  readonly validateOptions?: (options: Readonly<Partial<O>>) => void;
  readonly render: (context: RenderContext<O>) => string;
}

export interface AvatarOptions<O extends object = Record<string, never>> {
  readonly seed: string;
  readonly size?: number;
  readonly shape?: Shape;
  readonly title?: string;
  readonly background?: boolean;
  readonly palette?: PaletteInput;
  /** Unique per inline SVG instance within its containing document. */
  readonly idPrefix?: string;
  readonly options?: Partial<O>;
}

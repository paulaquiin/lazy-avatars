import { describe, expect, it } from 'vitest';
import {
  contrastRatio,
  extractInitials,
  normalizeColor,
  readable,
  renderPixelGlyphs,
  themes,
} from '../packages/core/src/index.js';

describe('initials and original glyphs', () => {
  it.each([
    ['Ana García', 'AG'],
    ['prod-db-01', 'PD'],
    ['bruno', 'BR'],
    ['ána.garcía@example.invalid', 'AG'],
    ['  ', '?'],
    ['🙂', '?'],
    ['李 明', '??'],
    ['ñandú', 'NA'],
    ['A', 'A'],
    ['runner_42', 'R4'],
  ])('%j becomes %s', (seed, expected) => expect(extractInitials(seed)).toBe(expected));

  it('uses geometry and a fallback rather than font text', () => {
    const output = renderPixelGlyphs('李', 0, 0, 2, '#123');
    expect(output).toBe(renderPixelGlyphs('?', 0, 0, 2, '#123'));
    expect(output).toContain('<rect');
    expect(output).not.toMatch(/<text|font|href/);
    expect(() => renderPixelGlyphs('A', 0, 0, 0, '#123')).toThrow();
  });
});

describe('colors', () => {
  it('normalizes colors and matches reference contrast ratios', () => {
    expect(normalizeColor('#AbC')).toBe('#aabbcc');
    expect(contrastRatio('#000', '#fff')).toBe(21);
    expect(contrastRatio('#123456', '#123456')).toBe(1);
    expect(contrastRatio('#777', '#fff')).toBeCloseTo(4.478, 3);
  });

  it('selects the first readable candidate or black/white fallback', () => {
    expect(readable('#fff', '#eee', '#123', '#000')).toBe('#112233');
    expect(readable('#fff', '#eee')).toBe('#000000');
    expect(readable('#000')).toBe('#ffffff');
    for (const palettes of Object.values(themes)) {
      for (const palette of palettes) {
        expect(
          contrastRatio(palette.background, readable(palette.background, palette.ink)),
        ).toBeGreaterThanOrEqual(3);
      }
    }
  });

  it.each(['red', 'url(https://example.invalid/a)', '#00000000', '#zzzzzz', '" onload="alert(1)'])(
    'rejects %s',
    (color) => {
      expect(() => normalizeColor(color)).toThrow();
    },
  );
});

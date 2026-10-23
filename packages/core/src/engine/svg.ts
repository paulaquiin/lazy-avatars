import { normalizeColor } from './color.js';

const tags = [
  'svg',
  'g',
  'defs',
  'clipPath',
  'rect',
  'circle',
  'ellipse',
  'path',
  'polygon',
  'polyline',
  'line',
  'linearGradient',
  'radialGradient',
  'stop',
  'title',
] as const;
type SvgTag = (typeof tags)[number];
const attributes = new Set([
  'xmlns',
  'viewBox',
  'width',
  'height',
  'x',
  'y',
  'x1',
  'x2',
  'y1',
  'y2',
  'cx',
  'cy',
  'r',
  'rx',
  'ry',
  'd',
  'points',
  'fill',
  'fill-rule',
  'stroke',
  'stroke-width',
  'stroke-linecap',
  'stroke-linejoin',
  'stroke-dasharray',
  'opacity',
  'fill-opacity',
  'stroke-opacity',
  'transform',
  'id',
  'clip-path',
  'clipPathUnits',
  'gradientUnits',
  'gradientTransform',
  'offset',
  'stop-color',
  'stop-opacity',
  'role',
  'aria-labelledby',
  'aria-hidden',
]);

export function escapeXml(value: string): string {
  // XML 1.0 excludes controls, lone surrogates and U+FFFE/U+FFFF.
  const clean = Array.from(value, (char) => {
    const code = char.codePointAt(0) ?? 0;
    const valid =
      code === 9 ||
      code === 10 ||
      code === 13 ||
      (code >= 0x20 && code <= 0xd7ff) ||
      (code >= 0xe000 && code <= 0xfffd) ||
      code >= 0x10000;
    return valid ? char : '\ufffd';
  }).join('');
  return clean.replace(
    /[&<>"']/g,
    (char) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[char] ?? char,
  );
}

export function svgNumber(value: number): string {
  if (!Number.isFinite(value) || Math.abs(value) > 1e9) throw new RangeError('Invalid SVG number');
  return String(Math.round(value * 10) / 10 || 0);
}

export function validateId(value: string): string {
  if (typeof value !== 'string' || !/^[a-z][a-z0-9_-]{0,63}$/i.test(value)) {
    throw new TypeError(
      'IDs must start with a letter and contain at most 64 letters, digits, _ or -',
    );
  }
  return value;
}

/** children must be escaped text or SVG produced by trusted collection code. */
export function svgElement(
  tag: SvgTag,
  attrs: Readonly<Record<string, string | number | undefined>> = {},
  children = '',
): string {
  if (!tags.includes(tag)) throw new TypeError('Unsupported SVG element');
  const serialized = Object.keys(attrs)
    .sort()
    .map((key) => {
      if (!attributes.has(key)) throw new TypeError(`Unsupported SVG attribute: ${key}`);
      const value = attrs[key];
      if (value === undefined) return '';
      let text = typeof value === 'number' ? svgNumber(value) : value;
      if (['fill', 'stroke', 'stop-color'].includes(key)) {
        if (text !== 'none' && !/^url\(#[a-z][a-z0-9_-]*\)$/i.test(text))
          text = normalizeColor(text);
      }
      if (key === 'clip-path' && !/^url\(#[a-z][a-z0-9_-]*\)$/i.test(text)) {
        throw new TypeError('clip-path must reference a local ID');
      }
      return ` ${key}="${escapeXml(text)}"`;
    })
    .join('');
  return children ? `<${tag}${serialized}>${children}</${tag}>` : `<${tag}${serialized}/>`;
}

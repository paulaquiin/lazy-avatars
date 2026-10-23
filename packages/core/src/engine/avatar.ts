import { themes } from '../themes/index.js';
import type { AvatarOptions, Collection, PaletteInput } from '../types.js';
import { canonicalStringify, deepFreeze, isPlainObject } from './canonical.js';
import { normalizePalette } from './color.js';
import { hashString, normalizeSeed } from './hash.js';
import { extractInitials } from './initials.js';
import { createRng } from './rng.js';
import { escapeXml, svgElement, validateId } from './svg.js';

function paletteChoices(input: PaletteInput | undefined, defaults: Collection<object>['palettes']) {
  const values =
    typeof input === 'string'
      ? Object.hasOwn(themes, input)
        ? themes[input]
        : undefined
      : input === undefined
        ? defaults
        : Array.isArray(input)
          ? input
          : [input];
  if (!values?.length) throw new TypeError('Unknown theme or empty palette list');
  return values.map(normalizePalette);
}

export function createAvatar<O extends object>(
  collection: Collection<O>,
  input: AvatarOptions<NoInfer<O>>,
): string {
  if (
    !collection ||
    !/^[a-z][a-z0-9-]*$/.test(collection.id) ||
    typeof collection.render !== 'function' ||
    !Number.isSafeInteger(collection.outputVersion) ||
    collection.outputVersion < 1
  ) {
    throw new TypeError('Invalid collection contract');
  }
  if (!isPlainObject(input)) throw new TypeError('Avatar options must be an object');
  const seed = normalizeSeed(input.seed);
  const size = input.size === undefined ? 64 : input.size;
  if (!Number.isInteger(size) || size < 1 || size > 4096)
    throw new RangeError('size must be an integer from 1 to 4096');
  const shape = input.shape === undefined ? 'rounded' : input.shape;
  if (!['square', 'rounded', 'circle'].includes(shape)) throw new TypeError('Invalid shape');
  const background = input.background === undefined ? true : input.background;
  if (typeof background !== 'boolean') throw new TypeError('background must be boolean');
  const title = input.title === undefined ? '' : input.title;
  if (typeof title !== 'string' || title.length > 1024)
    throw new TypeError('title must be a string of at most 1024 code units');
  if (input.idPrefix !== undefined) validateId(input.idPrefix);
  const rawOptions = input.options === undefined ? {} : input.options;
  if (!isPlainObject(rawOptions)) throw new TypeError('Collection options must be a plain object');
  const options = deepFreeze(JSON.parse(canonicalStringify(rawOptions)) as Partial<O>);
  collection.validateOptions?.(options);
  const rng = createRng(hashString(`${collection.id}:${seed}`));
  const palette = rng.fork('palette').pick(paletteChoices(input.palette, collection.palettes));
  const identity = canonicalStringify({
    collection: collection.id,
    version: collection.outputVersion,
    seed,
    size,
    shape,
    title,
    background,
    palette,
    options,
  });
  const namespace = `${input.idPrefix ?? 'la'}-${hashString(identity).toString(16)}`;
  const id = (name: string) => `${namespace}-part-${validateId(name)}`;
  const clipId = `${namespace}-clip`;
  const titleId = `${namespace}-title`;
  const context = Object.freeze({
    rng,
    seed,
    initials: extractInitials(seed),
    palette,
    options,
    id,
  });
  const drawing = collection.render(context);
  if (typeof drawing !== 'string') throw new TypeError('Collection render must return SVG text');
  const outline =
    shape === 'circle'
      ? svgElement('circle', { cx: 40, cy: 40, r: 40 })
      : svgElement('rect', { width: 80, height: 80, rx: shape === 'rounded' ? 12 : 0 });
  const defs = svgElement('defs', {}, svgElement('clipPath', { id: clipId }, outline));
  const content =
    (background ? svgElement('rect', { width: 80, height: 80, fill: palette.background }) : '') +
    drawing;
  return svgElement(
    'svg',
    {
      xmlns: 'http://www.w3.org/2000/svg',
      viewBox: '0 0 80 80',
      width: size,
      height: size,
      ...(title ? { role: 'img', 'aria-labelledby': titleId } : { 'aria-hidden': 'true' }),
    },
    (title ? svgElement('title', { id: titleId }, escapeXml(title)) : '') +
      defs +
      svgElement('g', { 'clip-path': `url(#${clipId})` }, content),
  );
}

export function createAvatarDataUri<O extends object>(
  collection: Collection<O>,
  options: AvatarOptions<NoInfer<O>>,
): string {
  const encoded = encodeURIComponent(createAvatar(collection, options)).replace(
    /[!'()*]/g,
    (char) => `%${char.charCodeAt(0).toString(16).toUpperCase()}`,
  );
  return `data:image/svg+xml;charset=utf-8,${encoded}`;
}

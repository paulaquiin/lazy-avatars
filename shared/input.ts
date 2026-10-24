import type { AvatarOptions, Collection } from 'lazy-avatars';
import { createAvatar } from 'lazy-avatars';

export const inputKeys = [
  'size',
  'shape',
  'theme',
  'palette',
  'background',
  'title',
  'idPrefix',
  'options',
] as const;

/** Only transports JSON and strings; the core remains the validation authority. */
export function parseInput(seed: string, values: URLSearchParams): AvatarOptions<object> {
  for (const key of values.keys()) {
    if (!(inputKeys as readonly string[]).includes(key))
      throw new TypeError(`Unknown option: ${key}`);
    if (values.getAll(key).length !== 1) throw new TypeError(`Duplicate option: ${key}`);
  }
  const result: Record<string, unknown> = { seed };
  for (const key of ['title', 'idPrefix', 'shape'] as const) {
    if (values.has(key)) result[key] = values.get(key);
  }
  if (values.has('size')) {
    const size = values.get('size') ?? '';
    if (!/^\d{1,4}$/.test(size)) throw new TypeError('size must be an integer');
    result.size = Number(size);
  }
  if (values.has('background')) {
    const value = values.get('background');
    if (value !== 'true' && value !== 'false')
      throw new TypeError('background must be true or false');
    result.background = value === 'true';
  }
  if (values.has('theme') && values.has('palette'))
    throw new TypeError('Use theme or palette, not both');
  if (values.has('theme')) result.palette = values.get('theme');
  if (values.has('palette')) result.palette = JSON.parse(values.get('palette') ?? '');
  if (values.has('options')) result.options = JSON.parse(values.get('options') ?? '');
  return result as unknown as AvatarOptions<object>;
}

export function renderInput(
  collection: Collection<object>,
  seed: string,
  values: URLSearchParams,
): string {
  return createAvatar(collection, parseInput(seed, values));
}

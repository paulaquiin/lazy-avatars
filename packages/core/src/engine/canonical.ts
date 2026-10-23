/** JSON-only collection options: sorted keys, no undefined array items or nonfinite numbers. */
export function canonicalStringify(value: unknown, depth = 0): string {
  if (depth > 20) throw new TypeError('Options are cyclic or too deeply nested');
  if (value === null || typeof value === 'string' || typeof value === 'boolean') {
    return JSON.stringify(value);
  }
  if (typeof value === 'number' && Number.isFinite(value)) return JSON.stringify(value);
  if (Array.isArray(value)) {
    return `[${Array.from(value, (entry) => canonicalStringify(entry, depth + 1)).join(',')}]`;
  }
  if (isPlainObject(value)) {
    return `{${Object.keys(value)
      .sort()
      .filter((key) => value[key] !== undefined)
      .map((key) => `${JSON.stringify(key)}:${canonicalStringify(value[key], depth + 1)}`)
      .join(',')}}`;
  }
  throw new TypeError('Options must contain only plain JSON data and finite numbers');
}

export function isPlainObject(value: unknown): value is Record<string, unknown> {
  return (
    value !== null &&
    typeof value === 'object' &&
    (Object.getPrototypeOf(value) === Object.prototype || Object.getPrototypeOf(value) === null)
  );
}

export function deepFreeze<T>(value: T): T {
  if (value && typeof value === 'object') {
    for (const child of Object.values(value)) deepFreeze(child);
    Object.freeze(value);
  }
  return value;
}

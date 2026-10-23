/** FNV-1a over UTF-8 bytes. Not a cryptographic hash or an identity guarantee. */
export function hashString(value: string): number {
  let hash = 0x811c9dc5;
  for (const byte of new TextEncoder().encode(value)) {
    hash = Math.imul(hash ^ byte, 0x01000193);
  }
  return hash >>> 0;
}

export function normalizeSeed(seed: string): string {
  if (typeof seed !== 'string') throw new TypeError('seed must be a string');
  const normalized = seed.trim().normalize('NFC');
  if (!normalized.length || normalized.length > 1024) {
    throw new RangeError('seed must contain 1–1024 UTF-16 code units after normalization');
  }
  return normalized;
}

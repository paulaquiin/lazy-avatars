/** Latin accents are folded; unsupported glyphs become a neutral question mark. */
export function extractInitials(seed: string): string {
  const local = seed.split('@')[0] ?? '';
  const words = local
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toUpperCase()
    .split(/[\s._-]+/u)
    .map((word) => Array.from(word).filter((char) => /[\p{L}\p{N}]/u.test(char)))
    .filter((word) => word.length);
  const selected = words.length > 1 ? [words[0]?.[0], words[1]?.[0]] : words[0]?.slice(0, 2);
  return (selected ?? ['?']).map((char) => (char && /^[A-Z0-9]$/.test(char) ? char : '?')).join('');
}

import { getCollection } from '../../../shared/catalogue.js';
import { renderInput } from '../../../shared/input.js';

export const usage = `Usage: lazy-avatars <collection> <seed> [--size 64] [--shape rounded]
  [--theme night | --palette '{"background":"#fff",...}']
  [--background false] [--title text] [--idPrefix instance]
  [--options '{"status":"warn"}']
Writes only SVG to stdout. Diagnostics go to stderr. Use --help for this message.
`;
export interface CliIo {
  stdout: (value: string) => void;
  stderr: (value: string) => void;
}
export function run(args: readonly string[], io: CliIo): number {
  try {
    if (args.length === 1 && args[0] === '--help') {
      io.stdout(usage);
      return 0;
    }
    const [id, seed, ...flags] = args;
    if (!id || seed === undefined || flags.length % 2 !== 0)
      throw new TypeError('Expected collection, seed and option/value pairs');
    const values = new URLSearchParams();
    for (let i = 0; i < flags.length; i += 2) {
      const flag = flags[i] ?? '';
      if (!/^--[A-Za-z]+$/.test(flag)) throw new TypeError('Invalid flag');
      values.append(flag.slice(2), flags[i + 1] ?? '');
    }
    io.stdout(renderInput(getCollection(id), seed, values));
    return 0;
  } catch {
    io.stderr('lazy-avatars: invalid collection, seed or options. Run --help.\n');
    return 1;
  }
}

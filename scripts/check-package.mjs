import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';
import { findSecretKinds } from './check-repository.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const core = join(root, 'packages/core');
const pnpmCli = process.env.npm_execpath;
assert(pnpmCli, 'Run this check with pnpm check:package');
const run = (args, cwd) =>
  execFileSync(process.execPath, [pnpmCli, ...args], {
    cwd,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
const inventory = JSON.parse(
  run(['exec', 'npm', 'pack', '--dry-run', '--json', '--ignore-scripts'], core),
)[0];
const paths = inventory.files.map((file) => file.path);
const allowed = new Set([
  'package.json',
  'README.md',
  'LICENSE',
  'dist/index.js',
  'dist/index.d.ts',
]);
assert.deepEqual(
  [...paths].sort(),
  [...allowed].sort(),
  'Package contains missing or unexpected files',
);
for (const path of paths) {
  const text = readFileSync(join(core, path), 'utf8');
  assert.equal(
    findSecretKinds(text).length,
    0,
    `Credential pattern in package file ${path}; value omitted`,
  );
}
const manifest = JSON.parse(readFileSync(join(core, 'package.json'), 'utf8'));
assert.equal(
  Object.keys(manifest.dependencies ?? {}).length,
  0,
  'Core must have no runtime dependencies',
);
assert.equal(Object.keys(manifest.peerDependencies ?? {}).length, 0, 'Core must have no peers');
assert.equal(manifest.sideEffects, false);
for (const conditions of Object.values(manifest.exports)) {
  for (const target of Object.values(conditions))
    assert(paths.includes(target.replace(/^\.\//, '')), `Missing export ${target}`);
}
const code = readFileSync(join(core, 'dist/index.js'), 'utf8');
assert(
  !/\bfrom\s*["'][^.'"]|\bimport\s*(?:\(\s*)?["'][^.'"]/.test(code),
  'Unexpected external runtime import',
);
assert(Buffer.byteLength(code) <= 24 * 1024, 'Core exceeds the initial 24 KiB ESM budget');
assert(gzipSync(code).length <= 8 * 1024, 'Core exceeds the initial 8 KiB gzip budget');
console.log(
  `Core ESM: ${Buffer.byteLength(code)} bytes; ${gzipSync(code).length} bytes gzip. Package: ${paths.length} allowed files.`,
);

const temporary = mkdtempSync(join(tmpdir(), 'lazy-avatars-consumer-'));
try {
  const packed = JSON.parse(
    run(
      ['exec', 'npm', 'pack', '--json', '--ignore-scripts', '--pack-destination', temporary],
      core,
    ),
  )[0];
  writeFileSync(
    join(temporary, 'package.json'),
    JSON.stringify({
      private: true,
      type: 'module',
      dependencies: {
        'lazy-avatars': `file:${join(temporary, packed.filename).replaceAll('\\', '/')}`,
      },
    }),
  );
  run(['install', '--offline', '--ignore-scripts', '--lockfile=false'], temporary);
  const consumer = `import assert from 'node:assert/strict';
import { createAvatar, themes, svgElement } from 'lazy-avatars';
const dot = { id: 'smoke', name: 'Smoke', outputVersion: 1, palettes: themes.mono, usesInitials: false, render: ({ palette }) => svgElement('circle', { cx: 40, cy: 40, r: 20, fill: palette.primary }) };
const svg = createAvatar(dot, { seed: 'consumer-demo' });
assert.equal(svg, createAvatar(dot, { seed: 'consumer-demo' }));
assert(svg.startsWith('<svg'));
const bytes = Buffer.byteLength(svg);
if (bytes > 4096) console.warn('::warning::Smoke SVG exceeds the 4 KiB advisory budget.');
console.log('Installed package: ESM import and SVG generation passed.');
`;
  writeFileSync(join(temporary, 'consumer.mjs'), consumer);
  console.log(
    execFileSync(process.execPath, ['consumer.mjs'], { cwd: temporary, encoding: 'utf8' }).trim(),
  );
  writeFileSync(
    join(temporary, 'consumer.ts'),
    `import { createAvatar, themes, type Collection } from 'lazy-avatars';
const c: Collection<{ kind: 'dot' }> = { id: 'smoke', name: 'Smoke', outputVersion: 1, palettes: themes.mono, usesInitials: false, render: () => '' };
createAvatar(c, { seed: 'demo', options: { kind: 'dot' } });
// @ts-expect-error public declarations preserve collection-specific options
createAvatar(c, { seed: 'demo', options: { kind: 'invalid' } });
`,
  );
  execFileSync(
    process.execPath,
    [
      join(root, 'node_modules/typescript/bin/tsc'),
      '--noEmit',
      '--strict',
      '--skipLibCheck',
      '--module',
      'nodenext',
      '--moduleResolution',
      'nodenext',
      '--target',
      'ES2022',
      'consumer.ts',
    ],
    { cwd: temporary, encoding: 'utf8' },
  );
  console.log('Installed package: public TypeScript declarations passed.');
} finally {
  // This directory comes exclusively from mkdtemp above; never delete a caller-supplied path.
  rmSync(temporary, { recursive: true, force: true });
}

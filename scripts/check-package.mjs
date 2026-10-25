import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, posix, resolve } from 'node:path';
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
  ...[
    'mosaic',
    'monogram',
    'rack',
    'siesta',
    'origami',
    'pantry',
    'deco',
    'latte',
    'constellation',
    'tinbot',
    'orbit',
    'mission',
    'helmet',
    'react',
    'web-component',
    'cli',
    'http',
    'cli-bin',
    'http-bin',
  ].flatMap((id) => [`dist/${id}.js`, `dist/${id}.d.ts`]),
]);
for (const path of paths) {
  if (/^dist\/(?:chunk-[\w-]+\.js|types-[\w-]+\.d\.ts)$/.test(path)) allowed.add(path);
}
if (manifestHasChangelog()) allowed.add('CHANGELOG.md');
function manifestHasChangelog() {
  return JSON.parse(readFileSync(join(core, 'package.json'), 'utf8')).files.includes(
    'CHANGELOG.md',
  );
}
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
assert.deepEqual(manifest.peerDependencies, { react: '^19.0.0' });
assert.deepEqual(manifest.peerDependenciesMeta, { react: { optional: true } });
assert.equal(manifest.sideEffects, false);
for (const conditions of Object.values(manifest.exports)) {
  for (const target of Object.values(conditions))
    assert(paths.includes(target.replace(/^\.\//, '')), `Missing export ${target}`);
}
function graph(entry) {
  const visited = new Set();
  function visit(path) {
    if (visited.has(path)) return;
    assert(paths.includes(path), `Missing dependency ${path}`);
    visited.add(path);
    const text = readFileSync(join(core, path), 'utf8');
    for (const match of text.matchAll(/\b(?:from\s*|import\s*)['"](\.[^'"]+)['"]/g)) {
      let target = posix.normalize(posix.join(posix.dirname(path), match[1]));
      if (path.endsWith('.d.ts')) target = target.replace(/\.js$/, '.d.ts');
      visit(target);
    }
  }
  visit(entry);
  return visited;
}
const rootGraph = graph('dist/index.js');
const code = [...rootGraph].map((path) => readFileSync(join(core, path), 'utf8')).join('\n');
for (const entry of [
  'dist/index.js',
  'dist/web-component.js',
  ...Object.keys(manifest.exports)
    .filter((s) => !['.', './react', './cli', './http', './web-component'].includes(s))
    .map((s) => `dist/${s.slice(2)}.js`),
]) {
  const source = [...graph(entry)].map((p) => readFileSync(join(core, p), 'utf8')).join('\n');
  assert(
    !/from ['"](?:react|node:)/.test(source),
    `${entry} imports an optional platform dependency`,
  );
}
assert(readFileSync(join(core, 'dist/react.js'), 'utf8').startsWith('"use client";'));
const reachable = new Set();
for (const [subpath, conditions] of Object.entries(manifest.exports)) {
  for (const target of Object.values(conditions))
    for (const path of graph(target.replace(/^\.\//, ''))) reachable.add(path);
  const moduleCode = [...graph(conditions.import.replace(/^\.\//, ''))]
    .map((path) => readFileSync(join(core, path), 'utf8'))
    .join('\n');
  for (const [id, name] of Object.entries({
    mosaic: 'Mosaico',
    monogram: 'Monograma',
    rack: 'Rack',
    siesta: 'Siesta',
    origami: 'Origami',
    pantry: 'Despensa',
    deco: 'Déco',
    latte: 'Latte',
    constellation: 'Constelación',
    tinbot: 'Hojalata',
    orbit: 'Órbita',
    mission: 'Misión',
    helmet: 'Casco',
  })) {
    if (!['./cli', './http'].includes(subpath) && subpath !== `./${id}`)
      assert(!moduleCode.includes(`name: "${name}"`), `${subpath} unexpectedly imports ${id}`);
  }
}
for (const target of Object.values(manifest.bin)) {
  for (const path of graph(target.replace(/^\.\//, ''))) reachable.add(path);
  const types = target.replace(/^\.\//, '').replace(/\.js$/, '.d.ts');
  for (const path of graph(types)) reachable.add(path);
}
for (const path of paths.filter((path) => path.startsWith('dist/')))
  assert(reachable.has(path), `Orphan distribution file ${path}`);
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
  run(
    [
      'install',
      '--offline',
      '--ignore-scripts',
      '--lockfile=false',
      '--config.auto-install-peers=false',
    ],
    temporary,
  );
  assert(
    !JSON.parse(readFileSync(join(temporary, 'node_modules/lazy-avatars/package.json'), 'utf8'))
      .dependencies,
  );
  assert(
    !existsSync(join(temporary, 'node_modules/react')),
    'Core install must not install optional React',
  );
  const consumer = `import assert from 'node:assert/strict';
import { createAvatar, themes, svgElement } from 'lazy-avatars';
import { mosaic } from 'lazy-avatars/mosaic';
import { monogram } from 'lazy-avatars/monogram';
import { rack } from 'lazy-avatars/rack';
import { siesta } from 'lazy-avatars/siesta';
import { origami } from 'lazy-avatars/origami';
import { pantry } from 'lazy-avatars/pantry';
import { deco } from 'lazy-avatars/deco';
import { latte } from 'lazy-avatars/latte';
import { constellation } from 'lazy-avatars/constellation';
import { tinbot } from 'lazy-avatars/tinbot';
import { orbit } from 'lazy-avatars/orbit';
import { mission } from 'lazy-avatars/mission';
import { helmet } from 'lazy-avatars/helmet';
for (const collection of [mosaic, monogram, rack, siesta, origami, pantry, deco, latte, constellation, tinbot, orbit, mission, helmet]) {
  const avatar = createAvatar(collection, { seed: 'consumer-demo', palette: 'night' });
  assert.equal(avatar, createAvatar(collection, { seed: 'consumer-demo', palette: 'night' }));
  assert(avatar.startsWith('<svg'));
  if (Buffer.byteLength(avatar) > 4096) console.warn('::warning::Collection SVG exceeds the 4 KiB advisory budget: ' + collection.id);
}
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
import { rack } from 'lazy-avatars/rack';
import { mosaic } from 'lazy-avatars/mosaic';
import { origami } from 'lazy-avatars/origami';
import { pantry } from 'lazy-avatars/pantry';
import { deco } from 'lazy-avatars/deco';
import { latte } from 'lazy-avatars/latte';
import { constellation } from 'lazy-avatars/constellation';
import { tinbot } from 'lazy-avatars/tinbot';
import { orbit } from 'lazy-avatars/orbit';
import { mission } from 'lazy-avatars/mission';
import { helmet } from 'lazy-avatars/helmet';
createAvatar(origami, { seed: 'demo', options: { animal: 'owl' } });
createAvatar(pantry, { seed: 'demo', options: { food: 'egg' } });
createAvatar(deco, { seed: 'demo', options: { motif: 'sun' } });
createAvatar(latte, { seed: 'demo', options: { art: 'rosetta' } });
createAvatar(constellation, { seed: 'demo' });
createAvatar(tinbot, { seed: 'demo', options: { antenna: 'double', eyes: 'gauges' } });
createAvatar(orbit, { seed: 'demo', options: { ring: 'wide', surface: 'bands' } });
createAvatar(mission, { seed: 'demo', options: { badge: 'shield', planet: 'striped' } });
createAvatar(helmet, { seed: 'demo', options: { visor: 'angular', reflection: 'ringed' } });
// @ts-expect-error distributed phase 3 enums remain specific
createAvatar(helmet, { seed: 'demo', options: { reflection: 'unknown' } });
// @ts-expect-error distributed phase 2 enums reject invalid values
createAvatar(origami, { seed: 'demo', options: { animal: 'dog' } });
createAvatar(rack, { seed: 'demo', options: { status: 'warn' } });
// @ts-expect-error distributed collection declarations retain enum validation
createAvatar(rack, { seed: 'demo', options: { status: 'invalid' } });
// @ts-expect-error distributed subpaths keep their own options
createAvatar(mosaic, { seed: 'demo', options: { status: 'warn' } });
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

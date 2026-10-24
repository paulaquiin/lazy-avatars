import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { createAvatar } from '../packages/core/dist/index.js';
import { rack } from '../packages/core/dist/rack.js';
import { findSecretKinds } from './check-repository.mjs';

const root = process.cwd();
const cli = process.env.npm_execpath;
assert(cli, 'Run through pnpm check:integrations');
const run = (args, cwd) =>
  execFileSync(process.execPath, [cli, ...args], {
    cwd,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
const temporary = mkdtempSync(join(tmpdir(), 'lazy-avatars-integrations-'));
try {
  const dependencies = {
    react: '19.3.1',
    'react-dom': '19.3.1',
    '@types/react': '19.3.0',
    '@types/node': '24.10.0',
  };
  const core = JSON.parse(
    run(
      ['exec', 'npm', 'pack', '--json', '--ignore-scripts', '--pack-destination', temporary],
      join(root, 'packages/core'),
    ),
  )[0];
  dependencies['lazy-avatars'] = `file:${join(temporary, core.filename)}`;
  for (const name of ['react', 'web-component', 'cli', 'http']) {
    const folder = join(root, 'packages', name);
    const info = JSON.parse(run(['pack', '--dry-run', '--json'], folder));
    const expected = ['package.json', 'README.md', 'LICENSE', 'dist/index.js', 'dist/index.d.ts'];
    if (name === 'cli' || name === 'http') expected.push('dist/bin.js', 'dist/bin.d.ts');
    assert.deepEqual(
      info.files.map((f) => f.path).sort(),
      expected.sort(),
      `Unexpected ${name} package contents`,
    );
    const manifest = JSON.parse(readFileSync(join(folder, 'package.json'), 'utf8'));
    assert.equal(manifest.license, 'MIT');
    assert.equal(manifest.sideEffects, false);
    assert.deepEqual(
      Object.keys(manifest.dependencies ?? {}),
      name === 'cli' || name === 'http' ? ['lazy-avatars'] : [],
    );
    for (const file of info.files) {
      const source = readFileSync(join(folder, file.path), 'utf8');
      assert.deepEqual(findSecretKinds(source), [], `Credential pattern in ${name}/${file.path}`);
      if (file.path.endsWith('.js')) {
        assert(
          !source.includes('name: "Mosaico"'),
          `${name} must import, not bundle, core artwork`,
        );
        if (name !== 'react') assert(!source.includes("from 'react'"));
      }
    }
    if (name === 'react')
      assert(readFileSync(join(folder, 'dist/index.js'), 'utf8').startsWith('"use client";'));
    if (name === 'cli' || name === 'http')
      assert(readFileSync(join(folder, 'dist/bin.js'), 'utf8').startsWith('#!/usr/bin/env node'));
    const archive = join(temporary, `${name}.tgz`);
    run(['pack', '--out', archive], folder);
    dependencies[manifest.name] = `file:${archive}`;
    console.log(
      `${manifest.name}: ${info.files.length} allowed distribution files; no internal tools or credential patterns.`,
    );
  }
  writeFileSync(
    join(temporary, 'package.json'),
    JSON.stringify({ private: true, type: 'module', dependencies }),
  );
  writeFileSync(
    join(temporary, 'pnpm-workspace.yaml'),
    `overrides:\n  lazy-avatars: ${JSON.stringify(dependencies['lazy-avatars'])}\n`,
  );
  const store = JSON.parse(readFileSync(join(root, 'node_modules/.modules.yaml'), 'utf8')).storeDir;
  run(
    [
      'install',
      '--offline',
      '--ignore-scripts',
      '--config.auto-install-peers=false',
      '--store-dir',
      dirname(store),
    ],
    temporary,
  );
  writeFileSync(
    join(temporary, 'consumer.mjs'),
    `import assert from 'node:assert/strict';
import {createElement} from 'react'; import {renderToString} from 'react-dom/server';
import {Avatar} from '@lazy-avatars/react'; import {registerLazyAvatar} from '@lazy-avatars/web-component';
import {run} from '@lazy-avatars/cli'; import {createAvatarServer} from '@lazy-avatars/http';
import {createAvatar} from 'lazy-avatars'; import {rack} from 'lazy-avatars/rack';
const options={seed:'demo',idPrefix:'consumer',title:'Demo'};
const html=renderToString(createElement(Avatar,{collection:rack,...options}));
assert(html.includes(createAvatar(rack,options)));assert.equal(typeof registerLazyAvatar,'function');
let result='';assert.equal(run(['rack','demo'],{stdout:s=>result+=s,stderr:s=>{throw new Error(s)}}),0);
assert.equal(result,createAvatar(rack,{seed:'demo'}));const server=createAvatarServer();assert(!server.listening);
console.log('Installed adapters: React SSR, SSR-safe web import, CLI SVG and inert HTTP factory passed.');`,
  );
  console.log(
    execFileSync(process.execPath, ['consumer.mjs'], { cwd: temporary, encoding: 'utf8' }).trim(),
  );
  const manifest = JSON.parse(
    readFileSync(join(temporary, 'node_modules/@lazy-avatars/cli/package.json'), 'utf8'),
  );
  assert.equal(
    manifest.dependencies['lazy-avatars'],
    '^0.3.0',
    'Pack must resolve workspace protocol',
  );
  const svg = execFileSync(
    process.execPath,
    ['node_modules/@lazy-avatars/cli/dist/bin.js', 'rack', 'demo'],
    { cwd: temporary, encoding: 'utf8' },
  );
  assert.equal(svg, createAvatar(rack, { seed: 'demo' }));
  writeFileSync(
    join(temporary, 'consumer.ts'),
    `import {Avatar} from '@lazy-avatars/react';
import {rack} from 'lazy-avatars/rack';import {registerLazyAvatar} from '@lazy-avatars/web-component';
import {run} from '@lazy-avatars/cli';import {createAvatarServer} from '@lazy-avatars/http';
Avatar({collection:rack,seed:'demo',options:{status:'warn'}});
// @ts-expect-error invalid collection option must remain rejected
Avatar({collection:rack,seed:'demo',options:{status:'invalid'}});
registerLazyAvatar({collections:[rack]});run(['--help'],{stdout:()=>{},stderr:()=>{}});createAvatarServer();`,
  );
  execFileSync(
    process.execPath,
    [
      resolve(root, 'node_modules/typescript/bin/tsc'),
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
  console.log('Installed adapters: executable CLI and public TypeScript declarations passed.');
} finally {
  rmSync(temporary, { recursive: true, force: true });
}

import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createAvatar } from '../packages/core/dist/index.js';
import { rack } from '../packages/core/dist/rack.js';

const docker = (...args) =>
  execFileSync('docker', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
docker('build', '-f', 'packages/http/Dockerfile', '-t', 'lazy-avatars-http:check', '.');
const container = docker(
  'run',
  '--rm',
  '--detach',
  '--read-only',
  '--cap-drop=ALL',
  '--security-opt=no-new-privileges',
  '-p',
  '127.0.0.1::3000',
  'lazy-avatars-http:check',
);
try {
  const mapping = docker('port', container, '3000/tcp');
  const port = /127\.0\.0\.1:(\d+)/.exec(mapping)?.[1];
  assert(port, 'Container must have a loopback port');
  const base = `http://127.0.0.1:${port}`;
  let ready = false;
  for (let i = 0; i < 40; i++) {
    try {
      if ((await fetch(`${base}/healthz`)).ok) {
        ready = true;
        break;
      }
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  assert(ready, 'Container health endpoint did not start');
  const r = await fetch(`${base}/rack/demo-server-01.svg?theme=night`);
  assert.equal(r.status, 200);
  assert.equal(r.headers.get('content-type'), 'image/svg+xml; charset=utf-8');
  assert.equal(await r.text(), createAvatar(rack, { seed: 'demo-server-01', palette: 'night' }));
  assert.equal((await fetch(`${base}/rack/demo.svg?size=0`)).status, 400);
  assert.equal(docker('exec', container, 'id', '-u'), '1000');
  console.log(
    'Docker: non-root, read-only container starts; health, SVG bytes/MIME and validation passed.',
  );
} finally {
  docker('stop', '--time', '10', container);
}

import { performance } from 'node:perf_hooks';
import { gzipSync } from 'node:zlib';
import { createAvatar } from '../packages/core/dist/index.js';

// Manual release measurement, not a timing gate or a new test suite.
const ids = [
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
];
const rows = [];
for (const id of ids) {
  const collection = (await import(`../packages/core/dist/${id}.js`))[id];
  for (let i = 0; i < 100; i++) createAvatar(collection, { seed: `warmup-${i}` });
  const start = performance.now();
  let bytes = 0,
    max = 0;
  for (let i = 0; i < 1000; i++) {
    const size = Buffer.byteLength(createAvatar(collection, { seed: `benchmark-${i}`, size: 32 }));
    bytes += size;
    max = Math.max(max, size);
  }
  const duration = performance.now() - start;
  const sample = createAvatar(collection, { seed: 'Ada Moss', size: 32 });
  rows.push({
    collection: id,
    renders: 1000,
    milliseconds: Number(duration.toFixed(1)),
    microsecondsPerAvatar: Number(((duration * 1000) / 1000).toFixed(1)),
    meanBytes: Math.round(bytes / 1000),
    maxBytes: max,
    sampleGzipBytes: gzipSync(sample).length,
  });
}
console.log(
  JSON.stringify(
    {
      node: process.version,
      platform: process.platform,
      arch: process.arch,
      method:
        '100 warmups then 1000 distinct seeds per collection; 32px, default options/palettes, no title',
      rows,
    },
    null,
    2,
  ),
);

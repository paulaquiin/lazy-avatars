import { copyFileSync } from 'node:fs';
import { defineConfig } from 'tsup';
export default defineConfig({
  entry: { index: 'src/index.ts' },
  format: ['esm'],
  target: 'es2022',
  dts: true,
  clean: true,
  splitting: false,
  sourcemap: false,
  external: ['react', 'lazy-avatars', /^lazy-avatars\//],
  banner: { js: '"use client";' },
  onSuccess() {
    copyFileSync('../../LICENSE', 'LICENSE');
  },
});

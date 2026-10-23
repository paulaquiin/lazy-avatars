import { copyFileSync } from 'node:fs';
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    mosaic: 'src/collections/mosaic/index.ts',
    monogram: 'src/collections/monogram/index.ts',
    rack: 'src/collections/rack/index.ts',
    siesta: 'src/collections/siesta/index.ts',
  },
  format: ['esm'],
  target: 'es2022',
  dts: true,
  clean: true,
  splitting: true,
  sourcemap: false,
  treeshake: true,
  async onSuccess() {
    copyFileSync('../../LICENSE', 'LICENSE');
  },
});

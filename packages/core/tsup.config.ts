import { copyFileSync } from 'node:fs';
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    mosaic: 'src/collections/mosaic/index.ts',
    monogram: 'src/collections/monogram/index.ts',
    rack: 'src/collections/rack/index.ts',
    siesta: 'src/collections/siesta/index.ts',
    origami: 'src/collections/origami/index.ts',
    pantry: 'src/collections/pantry/index.ts',
    deco: 'src/collections/deco/index.ts',
    latte: 'src/collections/latte/index.ts',
    constellation: 'src/collections/constellation/index.ts',
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

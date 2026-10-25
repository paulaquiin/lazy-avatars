import { copyFileSync, readFileSync, writeFileSync } from 'node:fs';
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
    tinbot: 'src/collections/tinbot/index.ts',
    orbit: 'src/collections/orbit/index.ts',
    mission: 'src/collections/mission/index.ts',
    helmet: 'src/collections/helmet/index.ts',
    react: 'src/integrations/react/index.ts',
    'web-component': 'src/integrations/web-component/index.ts',
    cli: 'src/integrations/cli/index.ts',
    'cli-bin': 'src/integrations/cli/bin.ts',
    http: 'src/integrations/http/index.ts',
    'http-bin': 'src/integrations/http/bin.ts',
  },
  format: ['esm'],
  target: 'es2022',
  dts: true,
  clean: true,
  splitting: true,
  sourcemap: false,
  treeshake: true,
  external: ['react'],
  async onSuccess() {
    copyFileSync('../../LICENSE', 'LICENSE');
    writeFileSync('dist/react.js', `"use client";\n${readFileSync('dist/react.js', 'utf8')}`);
  },
});

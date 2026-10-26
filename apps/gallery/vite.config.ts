import { defineConfig } from 'vite';
import { discoveryPages } from './seo.js';

export default defineConfig({
  base: './',
  plugins: [discoveryPages()],
  build: { target: 'es2022' },
});

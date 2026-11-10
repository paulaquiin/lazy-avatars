import { existsSync, readFileSync } from 'node:fs';
import { extname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import { discoveryPages } from './seo.js';

const assetsRoot = fileURLToPath(new URL('../../assets/', import.meta.url));

export default defineConfig({
  base: './',
  plugins: [
    discoveryPages(),
    {
      name: 'gallery-dev-assets',
      configureServer(server) {
        server.middlewares.use((request, response, next) => {
          const pathname = new URL(request.url ?? '/', 'http://localhost').pathname;
          const match = /^\/assets\/(brand|previews)\/([a-z0-9-]+\.(?:svg|png))$/.exec(pathname);
          if (!match) return next();

          const file = resolve(assetsRoot, match[1] as string, match[2] as string);
          if (!existsSync(file)) return next();
          response.setHeader(
            'Content-Type',
            extname(file) === '.svg' ? 'image/svg+xml' : 'image/png',
          );
          response.end(readFileSync(file));
        });
      },
    },
  ],
  build: { target: 'es2022' },
});

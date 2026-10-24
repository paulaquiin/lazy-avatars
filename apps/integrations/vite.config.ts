import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { defineConfig } from 'vite';
import { Example } from './src/example.js';
export default defineConfig({
  base: './',
  build: { target: 'es2022' },
  plugins: [
    {
      name: 'avatar-ssr-example',
      transformIndexHtml(html) {
        return html.replace(
          '<!--ssr-->',
          renderToString(createElement(Example), { identifierPrefix: 'example-' }),
        );
      },
    },
  ],
});

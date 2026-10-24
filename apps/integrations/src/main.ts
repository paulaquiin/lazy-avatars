import { registerLazyAvatar } from '@lazy-avatars/web-component';
import { orbit } from 'lazy-avatars/orbit';
import { rack } from 'lazy-avatars/rack';
import { createElement } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { Example } from './example.js';

const root = document.getElementById('react-root');
if (!root) throw new Error('Missing SSR root');
const before = root.innerHTML;
const errors: string[] = [];
hydrateRoot(root, createElement(Example), {
  identifierPrefix: 'example-',
  onRecoverableError(error) {
    errors.push(String(error));
  },
});
Object.assign(window, { integrationReview: { before, errors }, registerLazyAvatar });
registerLazyAvatar({ collections: [orbit, rack] });

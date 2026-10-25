import { orbit } from 'lazy-avatars/orbit';
import { Avatar } from 'lazy-avatars/react';
import { createElement, useState } from 'react';

export function Example() {
  const [seed, setSeed] = useState('Ada Moss');
  return createElement(
    'section',
    {},
    createElement(
      'button',
      { type: 'button', id: 'change-seed', onClick: () => setSeed('Cora Oak') },
      'Change seed',
    ),
    createElement(Avatar, { collection: orbit, seed, title: 'Orbit avatar' }),
    createElement(Avatar, { collection: orbit, seed, title: 'Orbit avatar' }),
    createElement(Avatar, { collection: orbit, seed }),
  );
}

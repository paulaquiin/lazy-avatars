# Despensa · `pantry`

Original overhead food illustrations: donut, sliced citrus, fried egg and avocado.
Five warm, green and fruit palettes use the common five color roles. Food, tilt,
sprinkles, citrus segment count (6–9), yolk position and pit size use named streams.

```ts
import { createAvatar } from 'lazy-avatars';
import { pantry } from 'lazy-avatars/pantry';
createAvatar(pantry, { seed: 'Ada Moss', options: { food: 'citrus' } });
```

`food`: `donut | citrus | egg | avocado`; omitted selects deterministically.
No initials. Sprinkles are limited to five; the main silhouette carries the
identity at 32 px. Themes recolor the illustration, including the egg and fruit;
these are stylized symbols rather than realistic food colors. All artwork is
original MIT. `outputVersion: 1`.

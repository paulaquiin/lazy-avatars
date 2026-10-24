# Origami

Original folded-paper animal heads for people and teams. Angular fox, cat, bear
and owl silhouettes use two paper tones, a visible fold and a pastel background.
The animal, jaw, brow and fold vary through independent deterministic streams.
Five original palettes cover terracotta, sage, lavender, blue and ochre.

```ts
import { createAvatar } from 'lazy-avatars';
import { origami } from 'lazy-avatars/origami';
createAvatar(origami, { seed: 'Ada Moss', options: { animal: 'fox' } });
```

`animal`: `fox | cat | bear | owl`; omitted selects deterministically. No initials.
The silhouette and eyes remain readable at 32 px; the fine fold is decorative.
All paths and palettes are original MIT artwork. `outputVersion: 1`.

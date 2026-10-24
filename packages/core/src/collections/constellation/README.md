# Constelación · `constellation`

A minimal connected constellation of 4–6 main stars with seven subdued background
specks. Star count, angular sectors, radii, open/closed graph, size and rotation
use named deterministic streams. Five original night-sky palettes. No initials.

```ts
import { createAvatar } from 'lazy-avatars';
import { constellation } from 'lazy-avatars/constellation';
createAvatar(constellation, { seed: 'Ada Moss', palette: 'night' });
```

There are no collection-specific options. Angular ordering prevents crossing
edges; bounded radii leave the main stars apart and inside circular crops.
Main lines are 2.5 viewBox units (1 px at 32 px), with at least 3:1 contrast against
the background, as are the main stars. Background specks are decorative and may
disappear at 24 px. Light themes intentionally use dark lines on a light sky.
With `background: false`, contrast depends on the embedding surface. No planets,
astronauts, initial ribbons or remote assets. All artwork is original MIT.
`outputVersion: 1`.

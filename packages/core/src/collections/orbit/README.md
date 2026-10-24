# Órbita · `orbit`

Volumetric planets for teams and projects: bands or craters, split-depth rings,
a small optional moon and a shaded hemisphere. Five original night-sky palettes.
The filled sphere deliberately differs from the line-only Constellation style.

```ts
import { createAvatar } from 'lazy-avatars';
import { orbit } from 'lazy-avatars/orbit';
createAvatar(orbit, {
  seed: 'Ada Moss',
  options: {
    surface: 'bands',
    ring: 'wide',
    moon: 'small',
  },
});
```

| Option    | Values                 | Default                  |
| --------- | ---------------------- | ------------------------ |
| `surface` | `bands`, `craters`     | Uniform seeded selection |
| `ring`    | `none`, `thin`, `wide` | Uniform seeded selection |
| `moon`    | `none`, `small`        | Uniform seeded selection |

Planet size, ring tilt, band spacing, crater count/positions and moon position/size
use named independent streams. The back ring is occluded by the planet; its front
half is drawn afterward. Surface marks are clipped to the sphere. The moon remains
inside circular crops. No initials. Reflections and small craters simplify at
24 px; the target is 32 px. All paths and palettes are original MIT.
`outputVersion: 1`.

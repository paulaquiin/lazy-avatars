# Hojalata · `tinbot`

Original 1950s tin-toy robot heads for bots, runners and playful team directories.
Five retro metal palettes, rivets and stamped highlights; no initials or fonts.

```ts
import { createAvatar } from 'lazy-avatars';
import { tinbot } from 'lazy-avatars/tinbot';
createAvatar(tinbot, {
  seed: 'demo-runner-01',
  options: {
    antenna: 'double',
    eyes: 'gauges',
    mouth: 'grille',
  },
});
```

| Option    | Values                     | Default                  |
| --------- | -------------------------- | ------------------------ |
| `antenna` | `single`, `double`, `dome` | Uniform seeded selection |
| `eyes`    | `gauges`, `visor`, `mixed` | Uniform seeded selection |
| `mouth`   | `grille`, `smile`, `dots`  | Uniform seeded selection |

Antenna height, head corners/height and gaze use independent named streams.
Rivets and reflections are decorative and simplify at 24 px. The target is 32 px.
All geometry and palettes are original MIT artwork. `outputVersion: 1`.

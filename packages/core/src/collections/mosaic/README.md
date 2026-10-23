# Mosaico · `mosaic`

Original 4×4 Truchet tiles, five bicolor palettes. `outputVersion: 1`.

```ts
import { createAvatar } from 'lazy-avatars';
import { mosaic } from 'lazy-avatars/mosaic';
const svg = createAvatar(mosaic, { seed: 'Ada Moss', options: { tile: 'arcs' } });
```

| Option | Values              | Default       |
| ------ | ------------------- | ------------- |
| `tile` | `arcs`, `triangles` | Seed-selected |

The tile kind, 16 orientations and palette have independent named RNG streams.
Foreground contrast is selected against the primary color. This artwork fills the
canvas: `background: false` removes the common background but does not remove the
tiles' own colors. All shapes and global themes are supported. No initials or fonts.

MIT, original geometry. Twenty seed snapshots and the shared 60-seed/theme/XML/
size checks live in `tests/collections.test.ts` at the repository root. The gallery
provides the visual contact sheet at 24, 32, 64 and 128 px.

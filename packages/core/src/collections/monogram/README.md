# Monograma · `monogram`

Serif initials inside a double circle, shield or diamond seal. Eight corporate and
inverse palettes. `outputVersion: 1`.

```ts
import { createAvatar } from 'lazy-avatars';
import { monogram } from 'lazy-avatars/monogram';
const svg = createAvatar(monogram, { seed: 'Ána García', options: { frame: 'shield' } });
```

| Option  | Values                        | Default       |
| ------- | ----------------------------- | ------------- |
| `frame` | `circle`, `shield`, `diamond` | Seed-selected |

Latin accents are folded; A–Z and 0–9 are supported. Unsupported initials use a
neutral question mark. Single initials are enlarged and two initials are centered.
The serif alphabet is original centerline path artwork on a 10×14 grid, with no
external font, conversion or font license. All artwork is MIT. The frame and letter
colors are selected for contrast against the seal's primary fill.

Snapshots and the shared 60-seed/theme/XML/size checks are in the root collection
tests; the gallery supplies frames, theme comparison and visual review sizes.

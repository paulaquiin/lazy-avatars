# Siesta · `siesta`

Soft sleepy creatures, eight gentle palettes, closed eyes and bedtime accessories.
The project's mascot candidate; this does not establish a final logo.
`outputVersion: 1`.

```ts
import { createAvatar } from 'lazy-avatars';
import { siesta } from 'lazy-avatars/siesta';
const svg = createAvatar(siesta, {
  seed: 'Ada Moss',
  options: { accessory: 'cap', body: 'cloud', mouth: 'yawn' },
});
```

| Option      | Values                                  | Default                         |
| ----------- | --------------------------------------- | ------------------------------- |
| `accessory` | `cap`, `zzz`, `mask`, `blanket`, `none` | Seed-selected, excluding `none` |
| `body`      | `round`, `pear`, `cloud`                | Seed-selected                   |
| `mouth`     | `smile`, `yawn`, `sleep`                | Seed-selected                   |

Each trait, eyes, blush, pose and palette has an independent RNG stream. A mask
replaces visible eyes; a blanket covers the lower body. Facial and accessory lines
use contrasting colors for global themes. No initials, fonts or external resources.
All creature paths are original MIT artwork.

Twenty snapshots and shared 60-seed/theme/XML/size checks cover the collection.
All body/mouth/accessory choices can be forced in the gallery for visual review.

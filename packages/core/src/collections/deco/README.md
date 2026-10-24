# Déco · `deco`

Symmetric art-deco fans, stepped arches and sunrise rays inside a chamfered frame.
Five palettes: gold on navy, charcoal, emerald or burgundy, and ink on cream.
Motif, width, height, rib/arch/ray count vary through separate seeded streams.

```ts
import { createAvatar } from 'lazy-avatars';
import { deco } from 'lazy-avatars/deco';
createAvatar(deco, { seed: 'Ada Moss', options: { motif: 'fan' } });
```

`motif`: `fan | arches | sun`; omitted selects deterministically. No initials.
Structural strokes are at least 2.5 viewBox units (1 px at 32 px). Foreground
colors use the core 3:1 contrast selection against the background in every theme.
Tiny frame ornaments are decorative. Original MIT paths. `outputVersion: 1`.

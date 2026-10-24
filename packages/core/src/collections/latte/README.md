# Latte

Overhead ceramic coffee cups with original heart, tulip, rosetta or concentric-ring
foam art. Five ceramic/table palettes; art, spread, petal/leaf count and handle
angle use independent deterministic streams. No initials or external assets.

```ts
import { createAvatar } from 'lazy-avatars';
import { latte } from 'lazy-avatars/latte';
createAvatar(latte, { seed: 'Ada Moss', options: { art: 'rosetta' } });
```

`art`: `heart | tulip | rosetta | rings`; omitted selects deterministically.
Foam is selected for at least 3:1 contrast against the coffee. Ring/leaf details
are simplified at 24 px; the design target is 32 px. Global themes recolor coffee
and ceramics using the same five roles. All artwork is original MIT.
`outputVersion: 1`.

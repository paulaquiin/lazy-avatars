# Misión · `mission`

Original mission patches for teams and projects: light-field badges, rocket,
low planet, orbital line, stars and a ribbon carrying Latin initials. Five
original light palettes. Global themes can intentionally make the field dark.

```ts
import { createAvatar } from 'lazy-avatars';
import { mission } from 'lazy-avatars/mission';
createAvatar(mission, {
  seed: 'Ada Moss',
  options: {
    badge: 'hexagon',
    planet: 'ringed',
    rocket: 'tilted',
  },
});
```

| Option   | Values                          | Default                  |
| -------- | ------------------------------- | ------------------------ |
| `badge`  | `shield`, `round`, `hexagon`    | Uniform seeded selection |
| `planet` | `striped`, `ringed`, `cratered` | Uniform seeded selection |
| `rocket` | `upright`, `tilted`             | Uniform seeded selection |

Planet size, stars and tilted rocket angle (24–38 degrees) use named streams.
All 36 A–Z/0–9 glyphs and the neutral question-mark fallback are original sans
centerline paths designed for this ribbon. No third-party font, converted font
outlines, agency logos or insignia are included. Accent folding and unsupported
alphabet fallback follow the core initials contract. Text supports the badge;
small glyph and rocket details simplify at 24 px. The design target is 32 px.
The lower planet is intentionally overlapped by the ribbon. All art is MIT.
`outputVersion: 1`.

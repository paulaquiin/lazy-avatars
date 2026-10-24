# Casco · `helmet`

An astronaut bust with ceramic helmet, collar and a planet reflected inside its
visor. Five suit/sky palettes include light and dark backgrounds. This is the
character silhouette of the space family, rather than a free planet or badge.

```ts
import { createAvatar } from 'lazy-avatars';
import { helmet } from 'lazy-avatars/helmet';
createAvatar(helmet, {
  seed: 'Ada Moss',
  options: {
    visor: 'angular',
    reflection: 'ringed',
    antenna: 'single',
  },
});
```

| Option       | Values                           | Default                  |
| ------------ | -------------------------------- | ------------------------ |
| `visor`      | `round`, `wide`, `angular`       | Uniform seeded selection |
| `reflection` | `ringed`, `cratered`, `crescent` | Uniform seeded selection |
| `antenna`    | `none`, `single`, `double`       | Uniform seeded selection |

Reflection size/position and shoulder width use independent named streams. All
reflection artwork and glass shine are clipped to the chosen visor. At 24 px
small craters and antenna tips are decorative; the target is 32 px. No initials,
fonts or external assets. Original MIT paths and palettes. `outputVersion: 1`.

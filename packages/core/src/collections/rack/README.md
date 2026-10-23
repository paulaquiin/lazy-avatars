# Rack · `rack`

Three server units, four chassis palettes, LCD initials and status LEDs.
`outputVersion: 1`.

```ts
import { createAvatar } from 'lazy-avatars';
import { rack } from 'lazy-avatars/rack';
const svg = createAvatar(rack, {
  seed: 'demo-host-01',
  options: { status: 'warn', unit: 'disks' },
});
```

| Option   | Values                      | Default                      |
| -------- | --------------------------- | ---------------------------- |
| `status` | `ok`, `warn`, `down`, `off` | `off`                        |
| `unit`   | `disks`, `vent`             | Seed-selected per lower unit |

The top unit always carries the LCD. The two lower units have independent streams.
Status colors are fixed (`#5cdd85`, `#f5b942`, `#f35d63`, `#69717a`) regardless of
theme. The avatar does not monitor infrastructure: provide an actual status from
your application, and include a textual label alongside the LEDs. The gallery's
server states are invented examples.

Original 3×5 pixel glyphs are rendered as compact paths; no font or remote asset.
Latin A–Z/0–9, accent folding and neutral fallback follow the core initials contract.
MIT. Twenty snapshots and shared 60-seed/theme/XML/size checks are included, plus
explicit tests for every status in every theme and both unit types.

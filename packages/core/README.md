# lazy-avatars

Dependency-free, deterministic SVG avatars. Thirteen original collections: Mosaic,
Monogram, Rack, Siesta, Origami, Pantry, Déco, Latte, Constellation, Tinbot, Orbit,
Mission and Helmet.

```sh
npm install lazy-avatars@1.0.0
```

ESM package for Node.js 24.11+ (24.x) or 26+ and modern browser bundlers.

[Gallery](https://paulaquiin.github.io/lazy-avatars/) · [Source and license](https://github.com/paulaquiin/lazy-avatars)

```ts
import { createAvatar, createAvatarDataUri } from 'lazy-avatars';
import { rack } from 'lazy-avatars/rack';
const svg = createAvatar(rack, {
  seed: 'demo-host-01',
  title: 'Demo host — warning',
  options: { status: 'warn' },
});
const src = createAvatarDataUri(rack, { seed: 'demo-host-01' });
```

| Subpath                      | Export          | Options                                                                                                                           |
| ---------------------------- | --------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `lazy-avatars/mosaic`        | `mosaic`        | `tile: 'arcs' / 'triangles'`                                                                                                      |
| `lazy-avatars/monogram`      | `monogram`      | `frame: 'circle' / 'shield' / 'diamond'`                                                                                          |
| `lazy-avatars/rack`          | `rack`          | `status: 'ok' / 'warn' / 'down' / 'off'`; `unit: 'disks' / 'vent'`                                                                |
| `lazy-avatars/siesta`        | `siesta`        | `accessory: 'cap' / 'zzz' / 'mask' / 'blanket' / 'none'`; `body: 'round' / 'pear' / 'cloud'`; `mouth: 'smile' / 'yawn' / 'sleep'` |
| `lazy-avatars/origami`       | `origami`       | `animal: 'fox' / 'cat' / 'bear' / 'owl'`                                                                                          |
| `lazy-avatars/pantry`        | `pantry`        | `food: 'donut' / 'citrus' / 'egg' / 'avocado'`                                                                                    |
| `lazy-avatars/deco`          | `deco`          | `motif: 'fan' / 'arches' / 'sun'`                                                                                                 |
| `lazy-avatars/latte`         | `latte`         | `art: 'heart' / 'tulip' / 'rosetta' / 'rings'`                                                                                    |
| `lazy-avatars/constellation` | `constellation` | No collection-specific options                                                                                                    |
| `lazy-avatars/tinbot`        | `tinbot`        | `antenna`: `single`, `double`, `dome`; `eyes`: `gauges`, `visor`, `mixed`; `mouth`: `grille`, `smile`, `dots`                     |
| `lazy-avatars/orbit`         | `orbit`         | `surface`: `bands`, `craters`; `ring`: `none`, `thin`, `wide`; `moon`: `none`, `small`                                            |
| `lazy-avatars/mission`       | `mission`       | `badge`: `shield`, `round`, `hexagon`; `planet`: `striped`, `ringed`, `cratered`; `rocket`: `upright`, `tilted`                   |
| `lazy-avatars/helmet`        | `helmet`        | `visor`: `round`, `wide`, `angular`; `reflection`: `ringed`, `cratered`, `crescent`; `antenna`: `none`, `single`, `double`        |

All collections have outputVersion 1. Visual options default to seeded selection;
Rack status defaults to off. It is a supplied display value, not live monitoring:
include a textual label with status LEDs. Each subpath retains typed options and
imports only its own artwork and shared engine helpers. Monogram serif paths and
Rack pixel glyphs and Mission sans paths are original MIT artwork, without third-party fonts. All five
phase 2 collections use original MIT paths and palettes. Deco and constellation
main lines are 1 px at 32 px, with at least 3:1 foreground/background contrast.
Light themes use dark constellation lines; global themes recolor food and coffee.
With transparent backgrounds, check contrast against your embedding surface.

You may also define your own typed Collection and use svgElement, themes and RNG
helpers from the root entry. Collection source documentation is in the repository.

ESM only. No Node built-ins, DOM, system fonts, remote assets or runtime packages
are required by the engine. The development baseline is Node 24.11+ (24.x) or 26+;
browser parity is tested in Chromium. Deno, Bun and other edge runtimes are targets,
not yet certified environments.

`createAvatarDataUri` returns a percent-encoded SVG for an `<img>` with an appropriate
`alt`. For repeated inline SVG, give each instance a different `idPrefix` to isolate
references. Without a title, the SVG is marked decorative (`aria-hidden="true"`).

Seeds: trimmed, NFC-normalized, case-sensitive, 1–1024 UTF-16 code units. Sizes:
integers from 1 to 4096, default 64. Shapes: `square`, `rounded` (default), `circle`.
Background defaults to `true`. Titles: at most 1024 code units; XML-invalid characters
are replaced. Empty seeds and invalid inputs throw; the engine does not silently
coerce them. No input object is mutated.

Themes: `pastel`, `corporate`, `night`, `earth`, `mono`; alternatively pass a palette
or nonempty palette list. Palettes require exactly `background`, `primary`,
`secondary`, `accent`, `ink`, each a `#RGB` or `#RRGGBB` color. `readable` chooses the
first candidate reaching 3:1 contrast, then falls back to the better of black/white.

Collection options must be plain JSON data with finite numbers and at most 20
levels of nesting. Object keys are sorted; undefined object properties are omitted.
Undefined array entries, cycles, functions, class instances and bigint are rejected.
Collections validate their own option names, enums and defaults with `validateOptions`.
Render context options are cloned and frozen.

Collection renderers are trusted code and return SVG markup. Use `svgElement` and
`escapeXml` rather than interpolating user input into markup. This library is not a
sanitizer for arbitrary third-party SVG or untrusted collection implementations.

Same collection/output version, normalized seed and effective options give identical
bytes. Forks are derived from the root uint32 hash plus the complete path serialized
as JSON; they do not consume their parent. Fork names and output versions are part of
the stability contract. Hashes can collide and do not anonymize personal data.

Code, documentation and original artwork, including all glyphs: MIT; preserve the included license
when redistributing copies or substantial portions. No third-party font is bundled.

Stable 1.0 preserves 0.3.0 SVG output. Changes to existing valid SVG bytes require
a major release and the affected collection outputVersion increment. Pin versions
or store SVG for historical output. See the repository stability/migration and
compatibility documents. Code, glyphs and Siesta branding are original MIT.

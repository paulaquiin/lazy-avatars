# lazy-avatars

[![npm version](https://img.shields.io/npm/v/lazy-avatars)](https://www.npmjs.com/package/lazy-avatars) [![npm downloads](https://img.shields.io/npm/dm/lazy-avatars)](https://www.npmjs.com/package/lazy-avatars) [![CI](https://github.com/paulaquiin/lazy-avatars/actions/workflows/ci.yml/badge.svg)](https://github.com/paulaquiin/lazy-avatars/actions/workflows/ci.yml) [![Core ESM gzip](https://img.shields.io/badge/core_ESM_gzip-5.3_KiB-315647)](https://github.com/paulaquiin/lazy-avatars/blob/main/docs/COMPATIBILITY.md) [![MIT license](https://img.shields.io/npm/l/lazy-avatars)](https://github.com/paulaquiin/lazy-avatars/blob/main/LICENSE)

lazy-avatars is a deterministic SVG avatar library for JavaScript and TypeScript applications: user profiles, teams, servers and bots. It includes 13 original collections, a core with zero runtime dependencies, optional React and web component entries, and MIT-licensed original artwork.

## Collection previews

Real SVG output from the library. Examples use `seed: 'Ada Moss'`, `size: 128` and `shape: 'rounded'`; Rack uses `demo-host-01` with `status: 'warn'`, as in the code below. [Explore variants in the gallery](https://lazyavatars.paulaquiin.com/).

| <img src="https://raw.githubusercontent.com/paulaquiin/lazy-avatars/8ef5669ddb5134948646ef63337add4a059a70d6/assets/previews/mosaic.svg" width="96" height="96" alt="Mosaic"><br>Mosaic                      | <img src="https://raw.githubusercontent.com/paulaquiin/lazy-avatars/8ef5669ddb5134948646ef63337add4a059a70d6/assets/previews/monogram.svg" width="96" height="96" alt="Monogram"><br>Monogram | <img src="https://raw.githubusercontent.com/paulaquiin/lazy-avatars/8ef5669ddb5134948646ef63337add4a059a70d6/assets/previews/rack.svg" width="96" height="96" alt="Rack"><br>Rack    | <img src="https://raw.githubusercontent.com/paulaquiin/lazy-avatars/8ef5669ddb5134948646ef63337add4a059a70d6/assets/previews/siesta.svg" width="96" height="96" alt="Siesta"><br>Siesta    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| <img src="https://raw.githubusercontent.com/paulaquiin/lazy-avatars/8ef5669ddb5134948646ef63337add4a059a70d6/assets/previews/origami.svg" width="96" height="96" alt="Origami"><br>Origami                   | <img src="https://raw.githubusercontent.com/paulaquiin/lazy-avatars/8ef5669ddb5134948646ef63337add4a059a70d6/assets/previews/pantry.svg" width="96" height="96" alt="Pantry"><br>Pantry       | <img src="https://raw.githubusercontent.com/paulaquiin/lazy-avatars/8ef5669ddb5134948646ef63337add4a059a70d6/assets/previews/deco.svg" width="96" height="96" alt="Déco"><br>Déco    | <img src="https://raw.githubusercontent.com/paulaquiin/lazy-avatars/8ef5669ddb5134948646ef63337add4a059a70d6/assets/previews/latte.svg" width="96" height="96" alt="Latte"><br>Latte       |
| <img src="https://raw.githubusercontent.com/paulaquiin/lazy-avatars/8ef5669ddb5134948646ef63337add4a059a70d6/assets/previews/constellation.svg" width="96" height="96" alt="Constellation"><br>Constellation | <img src="https://raw.githubusercontent.com/paulaquiin/lazy-avatars/8ef5669ddb5134948646ef63337add4a059a70d6/assets/previews/tinbot.svg" width="96" height="96" alt="Tinbot"><br>Tinbot       | <img src="https://raw.githubusercontent.com/paulaquiin/lazy-avatars/8ef5669ddb5134948646ef63337add4a059a70d6/assets/previews/orbit.svg" width="96" height="96" alt="Orbit"><br>Orbit | <img src="https://raw.githubusercontent.com/paulaquiin/lazy-avatars/8ef5669ddb5134948646ef63337add4a059a70d6/assets/previews/mission.svg" width="96" height="96" alt="Mission"><br>Mission |
| <img src="https://raw.githubusercontent.com/paulaquiin/lazy-avatars/8ef5669ddb5134948646ef63337add4a059a70d6/assets/previews/helmet.svg" width="96" height="96" alt="Helmet"><br>Helmet                      |                                                                                                                                                                                               |                                                                                                                                                                                      |                                                                                                                                                                                            |

## Install and render

```sh
npm install lazy-avatars@1.1.3
```

ESM package for Node.js 24.11+ (24.x) or 26+ and modern browser bundlers.

[Gallery](https://lazyavatars.paulaquiin.com/) · [Source and license](https://github.com/paulaquiin/lazy-avatars)

```ts
import { createAvatar, createAvatarDataUri } from 'lazy-avatars';
import { rack } from 'lazy-avatars/rack';
const svg = createAvatar(rack, {
  seed: 'demo-host-01',
  size: 128,
  shape: 'rounded',
  title: 'Demo host — warning',
  options: { status: 'warn' },
});
const src = createAvatarDataUri(rack, {
  seed: 'demo-host-01',
  size: 128,
  shape: 'rounded',
  options: { status: 'warn' },
});
// Use src as an <img> source with alt="Demo host: warning".
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

## Optional integration entries (1.1.0)

All integrations ship in this package. React is an optional peer; core users do
not install it. Node built-ins are used only by CLI/HTTP entry graphs.

```ts
import { Avatar } from 'lazy-avatars/react';
import { registerLazyAvatar } from 'lazy-avatars/web-component';
import { run } from 'lazy-avatars/cli';
import { createAvatarServer } from 'lazy-avatars/http';
```

Install React separately when using Avatar: `npm install react@19` (and its types
for TypeScript). Bins: `npx lazy-avatars rack demo` and `npx --package=lazy-avatars
lazy-avatars-http`. Library entries start no listener and register no elements
on import. Core rendering and collection outputVersion remain unchanged.

## React example

```sh
npm install lazy-avatars@1.1.3 react@19
# TypeScript projects: npm install --save-dev @types/react
```

```tsx
import { Avatar } from 'lazy-avatars/react';
import { rack } from 'lazy-avatars/rack';

export function HostAvatar() {
  return (
    <Avatar
      collection={rack}
      seed="demo-host-01"
      size={64}
      title="Demo host: warning"
      options={{ status: 'warn' }}
    />
  );
}
```

## Web component example

Register once in your browser application, with the collections it needs:

```ts
import { registerLazyAvatar } from 'lazy-avatars/web-component';
import { rack } from 'lazy-avatars/rack';

registerLazyAvatar({ collections: [rack] });
```

```html
<lazy-avatar
  collection="rack"
  seed="demo-host-01"
  size="64"
  title="Demo host: warning"
  options='{"status":"warn"}'
></lazy-avatar>
```

## CLI and self-hosted HTTP examples

```sh
npx --package=lazy-avatars@1.1.3 lazy-avatars rack demo-host-01 --options '{"status":"warn"}' > avatar.svg
npx --package=lazy-avatars@1.1.3 lazy-avatars-http
```

The server binds to `127.0.0.1:3000` by default. For example:

```text
http://127.0.0.1:3000/rack/demo-host-01.svg?size=64&options=%7B%22status%22%3A%22warn%22%7D
```

Or start it from your Node.js application:

```ts
import { createAvatarServer } from 'lazy-avatars/http';

const server = createAvatarServer();
server.listen(3000, '127.0.0.1');
// Call server.close() when your application shuts down.
```

## Migrating older packages

The four `@paulaquiin/lazy-avatars-*` packages are deprecated. Install
`lazy-avatars` and replace their imports with `lazy-avatars/react`,
`lazy-avatars/web-component`, `lazy-avatars/cli` or `lazy-avatars/http`.
Their component/function APIs are unchanged. See the
[migration guide](https://github.com/paulaquiin/lazy-avatars/blob/main/docs/INTEGRATIONS.md).

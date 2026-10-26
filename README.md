# lazy-avatars

[![npm version](https://img.shields.io/npm/v/lazy-avatars)](https://www.npmjs.com/package/lazy-avatars) [![npm downloads](https://img.shields.io/npm/dm/lazy-avatars)](https://www.npmjs.com/package/lazy-avatars) [![CI](https://github.com/paulaquiin/lazy-avatars/actions/workflows/ci.yml/badge.svg)](https://github.com/paulaquiin/lazy-avatars/actions/workflows/ci.yml) [![Core ESM gzip](https://img.shields.io/badge/core_ESM_gzip-5.3_KiB-315647)](https://github.com/paulaquiin/lazy-avatars/blob/main/docs/COMPATIBILITY.md) [![MIT license](https://img.shields.io/npm/l/lazy-avatars)](https://github.com/paulaquiin/lazy-avatars/blob/main/LICENSE)

Deterministic SVG avatar library for JavaScript and TypeScript applications: people, teams, servers and bots. Thirteen original collections, zero core runtime dependencies, optional React and web component entries, and MIT-licensed original artwork.

[Español](README.es.md) · [Gallery](https://paulaquiin.github.io/lazy-avatars/) · [CI](https://github.com/paulaquiin/lazy-avatars/actions/workflows/ci.yml) · [Architecture](docs/ARCHITECTURE.md) · [Roadmap](PLAN.md) · [MIT](LICENSE)

> **One package.** Core, thirteen collections and optional /react, /web-component, /cli and /http entries. React stays optional. See the [release record](docs/RELEASING.md).

## Collection previews

Real SVG output from the library. Examples use `seed: 'Ada Moss'`, `size: 128` and `shape: 'rounded'`; Rack uses `demo-host-01` with `status: 'warn'`, as in the code below. [Explore variants in the gallery](https://paulaquiin.github.io/lazy-avatars/).

| <img src="assets/previews/mosaic.svg" width="96" height="96" alt="Mosaic"><br>Mosaic                      | <img src="assets/previews/monogram.svg" width="96" height="96" alt="Monogram"><br>Monogram | <img src="assets/previews/rack.svg" width="96" height="96" alt="Rack"><br>Rack    | <img src="assets/previews/siesta.svg" width="96" height="96" alt="Siesta"><br>Siesta    |
| --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| <img src="assets/previews/origami.svg" width="96" height="96" alt="Origami"><br>Origami                   | <img src="assets/previews/pantry.svg" width="96" height="96" alt="Pantry"><br>Pantry       | <img src="assets/previews/deco.svg" width="96" height="96" alt="Déco"><br>Déco    | <img src="assets/previews/latte.svg" width="96" height="96" alt="Latte"><br>Latte       |
| <img src="assets/previews/constellation.svg" width="96" height="96" alt="Constellation"><br>Constellation | <img src="assets/previews/tinbot.svg" width="96" height="96" alt="Tinbot"><br>Tinbot       | <img src="assets/previews/orbit.svg" width="96" height="96" alt="Orbit"><br>Orbit | <img src="assets/previews/mission.svg" width="96" height="96" alt="Mission"><br>Mission |
| <img src="assets/previews/helmet.svg" width="96" height="96" alt="Helmet"><br>Helmet                      |                                                                                            |                                                                                   |                                                                                         |

## Use

Install the ESM package (Node.js 24.11+ on 24.x, or 26+, and modern browser bundlers):

```sh
npm install lazy-avatars@1.1.2
```

Import the engine and the collection you need:

```ts
import { createAvatar, createAvatarDataUri } from 'lazy-avatars';
import { rack } from 'lazy-avatars/rack';

const svg = createAvatar(rack, {
  seed: 'demo-host-01',
  size: 64,
  shape: 'rounded',
  title: 'Demo host — warning',
  options: { status: 'warn' },
});

const src = createAvatarDataUri(rack, {
  seed: 'demo-host-01',
  options: { status: 'warn' },
});
// Use src in an <img> with an appropriate alt attribute.
```

The root exports the engine and types. Import each collection separately; importing one does not pull in other collections. The core has no runtime dependencies, DOM access, network access or system-font requirements. Generated SVGs are self-contained.

| Collection    | Import                       | Options                                                                                                                    |
| ------------- | ---------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Mosaic        | `lazy-avatars/mosaic`        | `tile`: `arcs`, `triangles`                                                                                                |
| Monogram      | `lazy-avatars/monogram`      | `frame`: `circle`, `shield`, `diamond`                                                                                     |
| Rack          | `lazy-avatars/rack`          | `status`: `ok`, `warn`, `down`, `off`; `unit`: `disks`, `vent`                                                             |
| Siesta        | `lazy-avatars/siesta`        | `accessory`: `cap`, `zzz`, `mask`, `blanket`, `none`; `body`: `round`, `pear`, `cloud`; `mouth`: `smile`, `yawn`, `sleep`  |
| Origami       | `lazy-avatars/origami`       | `animal`: `fox`, `cat`, `bear`, `owl`                                                                                      |
| Pantry        | `lazy-avatars/pantry`        | `food`: `donut`, `citrus`, `egg`, `avocado`                                                                                |
| Déco          | `lazy-avatars/deco`          | `motif`: `fan`, `arches`, `sun`                                                                                            |
| Latte         | `lazy-avatars/latte`         | `art`: `heart`, `tulip`, `rosetta`, `rings`                                                                                |
| Constellation | `lazy-avatars/constellation` | No collection-specific options                                                                                             |
| Tinbot        | `lazy-avatars/tinbot`        | `antenna`: `single`, `double`, `dome`; `eyes`: `gauges`, `visor`, `mixed`; `mouth`: `grille`, `smile`, `dots`              |
| Orbit         | `lazy-avatars/orbit`         | `surface`: `bands`, `craters`; `ring`: `none`, `thin`, `wide`; `moon`: `none`, `small`                                     |
| Mission       | `lazy-avatars/mission`       | `badge`: `shield`, `round`, `hexagon`; `planet`: `striped`, `ringed`, `cratered`; `rocket`: `upright`, `tilted`            |
| Helmet        | `lazy-avatars/helmet`        | `visor`: `round`, `wide`, `angular`; `reflection`: `ringed`, `cratered`, `crescent`; `antenna`: `none`, `single`, `double` |

Omitted visual options are seed-selected. Rack's omitted status is always `off`; LEDs represent a value supplied by your application and do not monitor infrastructure. Always provide a textual status too. Monogram uses original serif paths; Rack uses original pixel paths; Mission uses original sans paths. No third-party font is bundled.

Themes: `pastel`, `corporate`, `night`, `earth`, `mono`, or an explicit five-role palette/list. Seeds are trimmed, NFC-normalized and case-sensitive: `Ana` differs from `ana`. Blank seeds are rejected. Same collection/output version, normalized seed and effective options produce the same SVG bytes. Version-pin the package or save the SVG to preserve historical output. See the [full core contract](packages/core/README.md).

Use a different `idPrefix` per inline SVG instance; `<img>` data URIs isolate references automatically. `background: false` removes the common background, not intrinsic artwork (Mosaic still fills its tiles). Readability targets 32 px; 24 px is a stress test.

## Gallery

Choose collection, seed, shape, theme, transparent background and collection-specific options. Compare sizes (24–128 px), 12/60 invented identities, five global themes and collection palettes, or realistic member/comment/profile/server contexts. Review contacts at 24, 32, 64 and 128 px over light/dark pages. Copy API/image code or download the SVG. The space-family view compares Constellation, Orbit, Mission and Helmet with the same seed at 32/64/128 px. The React tab generates integration code.

The URL stores the current state, including the seed. Sharing a gallery URL shares that text. Use invented names and hostnames; hashing does not anonymize personal or infrastructure data. There are no remote image/font requests or analytics.

## Integrations

One install: `npm install lazy-avatars@1.1.2`.
Use `lazy-avatars/react`, `lazy-avatars/web-component`, `lazy-avatars/cli` and
`lazy-avatars/http`. React 19 is an optional peer: install it only for the React
entry. Core and collection imports load no React, DOM or Node server code.
The npm archive includes all entries; bundlers follow only the imports you use.
See [migration and examples](docs/INTEGRATIONS.md).

## Develop

Requires Node `^24.11.0 || >=26.0.0` and pnpm `11.25.0`:

```sh
pnpm install --frozen-lockfile
pnpm exec playwright install chromium
pnpm check
pnpm dev
```

On Linux use `pnpm exec playwright install --with-deps chromium`. `pnpm dev` builds the core, watches it and starts the gallery at the Vite URL (normally `http://127.0.0.1:5173`). `pnpm typecheck` also builds declarations first, so it works from a clean checkout.

Individual checks: `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`, `pnpm check:repo`, `pnpm check:package`, `pnpm check:integrations`, `pnpm test:browser`, `pnpm check:docker`. Build before the standalone package/browser checks. `pnpm format` applies formatting and safe fixes; `pnpm changeset` records public changes.

Quality gates include 123 unit tests, 20 fixed snapshots per collection plus the engine fixture, 60-seed/theme/XML/size checks, 30 Chromium tests, and an actual isolated tarball installation with public types. Package checks follow the import graph to enforce collection isolation and catch orphan/missing chunks. The core's reachable module budget is 24 KiB raw / 8 KiB gzip; generated SVGs target 4 KiB. CI covers Linux/Node 24.11 and 26, and Windows/Node 24. Deno, Bun and edge remain compatibility targets.

Git contains public source, documentation, reviewed artwork, reproducible project scripts, tests and the lockfile. [.gitignore](.gitignore) excludes internal tools, assistant state, credentials, dependencies and generated output. `check:repo` checks paths, common credential patterns and available Git history without printing matched values; it is not an exhaustive secret audit. npm uses a positive file inventory: built entrypoints/shared chunks/types, README, LICENSE, CHANGELOG and manifest. See [repository hygiene](docs/REPOSITORY_HYGIENE.md).

## Roadmap

Phase 0 provides the engine and tools. Phases 1–3 complete thirteen collections and the gallery. Phase 4 provides React/web component/CLI/self-hosted HTTP integrations. Phase 5 completes the stable 1.0 release. See [deliverables and exit criteria](PLAN.md#9-hoja-de-ruta). This project promises no hosted public image API.

## License

[MIT](LICENSE) covers code, documentation and original artwork, including generated avatars made entirely from that artwork. Personal, educational, internal and commercial use, modification and redistribution are allowed. Preserve the copyright and license when redistributing copies or substantial portions. You do not need to publish your application's source. The software is supplied without warranty. Future third-party assets retain their own terms and notices.

Contributing: [guide](CONTRIBUTING.md). Original MIT [Siesta identity](assets/brand/README.md); [third-party notices](THIRD_PARTY_NOTICES.md).

Sourced comparison: [lazy-avatars, Boring Avatars and DiceBear](docs/comparison.md). [Discovery and publication checklist](docs/DISCOVERY.md).

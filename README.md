# lazy-avatars

Deterministic SVG avatars for people, teams, servers and bots. Nine original collections, no runtime dependencies, no image service.

[Español](README.es.md) · [Gallery](https://paulaquiin.github.io/lazy-avatars/) · [CI](https://github.com/paulaquiin/lazy-avatars/actions/workflows/ci.yml) · [Architecture](docs/ARCHITECTURE.md) · [Roadmap](PLAN.md) · [MIT](LICENSE)

> **Phase 2 · v0.2.0 prepared.** Origami, Pantry, Déco, Latte and Constellation join the original four collections. This branch contains all nine; npm still serves v0.1.0 with four collections until v0.2.0 publication is completed. See [PHASE2_REVIEW.md](docs/PHASE2_REVIEW.md).

## Use

Install the ESM package (Node.js 24.11+ on 24.x, or 26+, and modern browser bundlers):

```sh
npm install lazy-avatars@0.2.0
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

| Collection    | Import                       | Options                                                                                                                   |
| ------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Mosaic        | `lazy-avatars/mosaic`        | `tile`: `arcs`, `triangles`                                                                                               |
| Monogram      | `lazy-avatars/monogram`      | `frame`: `circle`, `shield`, `diamond`                                                                                    |
| Rack          | `lazy-avatars/rack`          | `status`: `ok`, `warn`, `down`, `off`; `unit`: `disks`, `vent`                                                            |
| Siesta        | `lazy-avatars/siesta`        | `accessory`: `cap`, `zzz`, `mask`, `blanket`, `none`; `body`: `round`, `pear`, `cloud`; `mouth`: `smile`, `yawn`, `sleep` |
| Origami       | `lazy-avatars/origami`       | `animal`: `fox`, `cat`, `bear`, `owl`                                                                                     |
| Pantry        | `lazy-avatars/pantry`        | `food`: `donut`, `citrus`, `egg`, `avocado`                                                                               |
| Déco          | `lazy-avatars/deco`          | `motif`: `fan`, `arches`, `sun`                                                                                           |
| Latte         | `lazy-avatars/latte`         | `art`: `heart`, `tulip`, `rosetta`, `rings`                                                                               |
| Constellation | `lazy-avatars/constellation` | No collection-specific options                                                                                            |

Omitted visual options are seed-selected. Rack's omitted status is always `off`; LEDs represent a value supplied by your application and do not monitor infrastructure. Always provide a textual status too. Monogram uses original serif paths; Rack uses original pixel paths. No third-party font is bundled.

Themes: `pastel`, `corporate`, `night`, `earth`, `mono`, or an explicit five-role palette/list. Seeds are trimmed, NFC-normalized and case-sensitive: `Ana` differs from `ana`. Blank seeds are rejected. Same collection/output version, normalized seed and effective options produce the same SVG bytes. Version-pin the package or save the SVG to preserve historical output. See the [full core contract](packages/core/README.md).

Use a different `idPrefix` per inline SVG instance; `<img>` data URIs isolate references automatically. `background: false` removes the common background, not intrinsic artwork (Mosaic still fills its tiles). Readability targets 32 px; 24 px is a stress test.

## Gallery

Choose collection, seed, shape, theme, transparent background and collection-specific options. Compare sizes (24–128 px), 12/60 invented identities, five global themes and collection palettes, or realistic member/comment/profile/server contexts. Review contacts at 24, 32, 64 and 128 px over light/dark pages. Copy API/image code or download the SVG. React is explicitly deferred to phase 4.

The URL stores the current state, including the seed. Sharing a gallery URL shares that text. Use invented names and hostnames; hashing does not anonymize personal or infrastructure data. There are no remote image/font requests or analytics.

## Develop

Requires Node `^24.11.0 || >=26.0.0` and pnpm `11.25.0`:

```sh
pnpm install --frozen-lockfile
pnpm exec playwright install chromium
pnpm check
pnpm dev
```

On Linux use `pnpm exec playwright install --with-deps chromium`. `pnpm dev` builds the core, watches it and starts the gallery at the Vite URL (normally `http://127.0.0.1:5173`). `pnpm typecheck` also builds declarations first, so it works from a clean checkout.

Individual checks: `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`, `pnpm check:repo`, `pnpm check:package`, `pnpm test:browser`. Build before the standalone package/browser checks. `pnpm format` applies formatting and safe fixes; `pnpm changeset` records public changes.

Quality gates include 88 unit tests, 20 fixed snapshots per collection plus the engine fixture, 60-seed/theme/XML/size checks, 17 Chromium tests, and an actual isolated tarball installation with public types. Package checks follow the import graph to enforce collection isolation and catch orphan/missing chunks. The core's reachable module budget is 24 KiB raw / 8 KiB gzip; generated SVGs target 4 KiB. CI covers Linux/Node 24.11 and 26, and Windows/Node 24. Deno, Bun and edge remain compatibility targets.

Git contains public source, documentation, reviewed artwork, reproducible project scripts, tests and the lockfile. [.gitignore](.gitignore) excludes internal tools, assistant state, credentials, dependencies and generated output. `check:repo` checks paths, common credential patterns and available Git history without printing matched values; it is not an exhaustive secret audit. npm uses a positive file inventory: built entrypoints/shared chunks/types, README, LICENSE, CHANGELOG and manifest. See [repository hygiene](docs/REPOSITORY_HYGIENE.md).

## Roadmap

Phase 0 provides the engine and tools. Phases 1 and 2 add nine collections and the full gallery. Later phases add four more collections, React/web component/CLI/self-hosted HTTP integrations, then the stable 1.0 contract. See [deliverables and exit criteria](PLAN.md#9-hoja-de-ruta). This project promises no hosted public image API.

## License

[MIT](LICENSE) covers code, documentation and original artwork, including generated avatars made entirely from that artwork. Personal, educational, internal and commercial use, modification and redistribution are allowed. Preserve the copyright and license when redistributing copies or substantial portions. You do not need to publish your application's source. The software is supplied without warranty. Future third-party assets retain their own terms and notices.

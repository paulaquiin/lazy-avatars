# lazy-avatars

Deterministic SVG avatars for people, teams, servers and bots. One seed, a themed collection, no image storage.

[Español](README.es.md) · [Architecture](docs/ARCHITECTURE.md) · [Implementation plan (Spanish)](PLAN.md) · [MIT license](LICENSE)

> **Status: phase 0 implemented locally, unpublished `0.0.0`.** The deterministic engine, tools, tests and minimal gallery work from this workspace. The 13 themed collections are not implemented yet. CI runs on GitHub for pushes and pull requests; see [workflow results](https://github.com/paulaquiin/lazy-avatars/actions/workflows/ci.yml). Registry checks returned 404 for the proposed package names on 2026-10-23; this does not reserve the names or establish scope ownership.

## What we are building

- A TypeScript library that returns self-contained SVG strings, with no runtime dependencies in the core.
- Stable output for the same collection, output version, normalized seed and rendering options.
- Separate collection imports, so applications only bundle the collections they use.
- A fixed `80 × 80` viewBox, shapes, optional transparent backgrounds and five color roles shared by collections and themes.
- Initials drawn as paths or pixel shapes, without system fonts or remote resources.
- A static gallery for comparing seeds, sizes, themes and real interface contexts. Guaranteed minimum target: 32 px; 24 px is a visual stress test.

The current local verification covers Node 24.21 and Chromium on Windows. CI targets Node 24.11 (the minimum), Node 26 on Linux, and Node 24 on Windows. Deno, Bun and edge runtimes remain compatibility targets to verify before claiming support.

## Working engine API

Build the workspace first. This example uses the implemented API with an application-defined collection; themed subpaths such as `lazy-avatars/rack` will arrive in phase 1. Do not install the name from npm yet: this project has not published a package.

```ts
import {
  createAvatar,
  createAvatarDataUri,
  svgElement,
  themes,
  type Collection,
} from 'lazy-avatars';

const dot: Collection = {
  id: 'dot',
  name: 'Dot example',
  outputVersion: 1,
  palettes: themes.pastel,
  usesInitials: false,
  render: ({ palette }) => svgElement('circle', { cx: 40, cy: 40, r: 24, fill: palette.primary }),
};

const svg = createAvatar(dot, {
  seed: 'demo-person-01',
  size: 64,
  shape: 'rounded',
  title: 'Demo person',
});

const src = createAvatarDataUri(dot, { seed: 'demo-person-01' });
// Use src in an <img> with an appropriate alt attribute.
```

Seeds use `trim()` and Unicode NFC normalization, preserving case: `Ana` and `ana` are different. Empty seeds are rejected. Normalize emails to lowercase in your application if that is the identity behavior you need. Use invented identifiers in examples: a deterministic hash is not anonymization. Shared gallery URLs will expose their seed when URL state is introduced in phase 1.

The engine runs locally without an external image service. A self-hosted HTTP adapter is planned later. No public hosted API is promised. See the [core API contract](packages/core/README.md) for defaults, validation, trusted collection rendering and inline `idPrefix` requirements.

## Collections and delivery

| Milestone      | Collections / scope                                                                |
| -------------- | ---------------------------------------------------------------------------------- |
| Phase 0        | Workspace, core engine, test collection and minimal gallery                        |
| Phase 1 · v0.1 | `mosaic`, `monogram`, `rack`, `siesta`; complete gallery and first package release |
| Phase 2 · v0.2 | `origami`, `pantry`, `deco`, `latte`, `constellation`                              |
| Phase 3 · v0.3 | `tinbot`, `orbit`, `mission`, `helmet`                                             |
| Phase 4        | React, web component, CLI, self-hosted HTTP adapter and custom palette editor      |
| Phase 5 · v1.0 | Stable output contract, complete documentation and release review                  |

Phase 0 is implemented and locally verified; remote validation results are linked above. Phases 1–5 are planned. See [PLAN.md](PLAN.md#9-hoja-de-ruta) for deliverables, dependencies and exit criteria. The development-only test collection is outside the npm package.

## Architecture

A pnpm workspace contains the framework-independent core (`packages/core`) and the Vite and vanilla TypeScript gallery (`apps/gallery`). Thin integration packages will follow later. The core owns hashing, deterministic random streams, SVG construction, initials, original pixel glyphs and colors. Each future collection will own its visual rules, palettes and typed options.

Build tooling: tsup for ESM and declarations, Vitest for unit tests and output snapshots, Playwright for Chromium parity and gallery tests, Biome for lint and formatting, Changesets for releases, and GitHub Actions for checks. These are development tools, not core runtime dependencies. Exact versions are pinned in `package.json` and `pnpm-lock.yaml`.

See [the architecture decisions](docs/ARCHITECTURE.md), including determinism, inline SVG identifiers, package boundaries and publishing rules.

## Contributing and local development

Requires Node `^24.11.0 || >=26.0.0` and pnpm `11.25.0`. With pnpm installed, run:

```sh
pnpm install --frozen-lockfile
pnpm exec playwright install chromium
pnpm check
pnpm dev
```

On Linux, use `pnpm exec playwright install --with-deps chromium` to install browser system dependencies too. `pnpm dev` opens the minimal gallery server at the URL printed by Vite (normally `http://127.0.0.1:5173`). It only generates a development fixture; it does not display unreleased themed collections.

Individual commands: `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`, `pnpm check:repo`, `pnpm check:package`, `pnpm test:browser`. Build before running the package/browser checks. The typecheck and dev commands build the core automatically. `pnpm check` runs them in the required order. `pnpm format` applies formatting and safe lint fixes. `pnpm changeset` records public API/output changes.

Start with [the guide](PLAN.md), [architecture](docs/ARCHITECTURE.md) and [repository hygiene rules](docs/REPOSITORY_HYGIENE.md). `pnpm check` includes 38 unit tests, a 20-seed snapshot, package inventory and isolated installation/type checks, plus two Chromium tests. The initial core budgets are 24 KiB ESM / 8 KiB gzip; SVG has an advisory 4 KiB target. CI has no automatic publish step and does not require repository secrets.

Collection contributions will need original or appropriately licensed artwork, documented options, deterministic snapshots, and visual checks at 24, 32, 64 and 128 px. Do not add private data to fixtures or snapshots.

Only reusable project source, public documentation, reviewed assets, configuration, tests and the lockfile belong in Git. Credentials, internal tools, local assistant configuration, dependencies and build outputs are excluded by [.gitignore](.gitignore). The public scripts in `scripts/` reproduce CI checks for contributors; they are not private tooling. Git ignore rules cannot protect secrets already tracked: inspect staged changes before every commit. The repository check scans available Git history and common credential patterns without printing matched values; it is not an exhaustive secret audit. The package uses an explicit five-file allowlist checked against an actual pack dry run.

## License and permitted uses

The project code, documentation and original avatar artwork are available under [MIT](LICENSE). You may use them for personal, educational, internal and commercial projects, including proprietary applications; modify them; and redistribute or sell copies. There is no requirement to publish your application's source code. Include the copyright and license notice when redistributing copies or substantial portions of the licensed material. The software is provided without warranty.

Generated avatars made entirely from original project artwork may also be used in personal and commercial projects under the same license. Any future third-party glyphs or artwork must retain their own license and notices; MIT does not replace those terms. No third-party font or artwork is included at this stage. License review and required notices are release gates for collections that introduce such assets.

# lazy-avatars

Deterministic SVG avatars for people, teams, servers and bots. One seed, a themed collection, no image storage.

[Español](README.es.md) · [Architecture](docs/ARCHITECTURE.md) · [Implementation plan (Spanish)](PLAN.md) · [MIT license](LICENSE)

> **Status: planning, pre-implementation.** This repository currently contains the project guide and documentation. There is no working library, published gallery or release provided by this repository yet. Package names are provisional until registry availability is checked. The API below is a design proposal, not runnable code.

## What we are building

- A TypeScript library that returns self-contained SVG strings, with no runtime dependencies in the core.
- Stable output for the same collection, output version, normalized seed and rendering options.
- Separate collection imports, so applications only bundle the collections they use.
- A fixed `80 × 80` viewBox, shapes, optional transparent backgrounds and five color roles shared by collections and themes.
- Initials drawn as paths or pixel shapes, without system fonts or remote resources.
- A static gallery for comparing seeds, sizes, themes and real interface contexts. Guaranteed minimum target: 32 px; 24 px is a visual stress test.

The target environments are browsers, Node.js, Deno, Bun and edge runtimes. Compatibility will be verified before releases; it is not implemented yet.

## Intended usage

**Proposed API — available after implementation and publication:**

```ts
import { createAvatar, createAvatarDataUri } from 'lazy-avatars';
import { rack } from 'lazy-avatars/rack';

const svg = createAvatar(rack, {
  seed: 'demo-server-01',
  size: 64,
  shape: 'rounded',
  title: 'Demo server — warning',
  options: { status: 'warn' },
});

const src = createAvatarDataUri(rack, { seed: 'demo-server-01' });
// Once implemented: use src in an <img> with an appropriate alt attribute.
```

Seeds will use `trim()` and Unicode NFC normalization, preserving case: `Ana` and `ana` are different. Normalize emails to lowercase in your application if that is the identity behavior you need. Use invented identifiers in shared examples and gallery URLs: a deterministic hash is not anonymization, and a shared gallery link exposes its seed.

The library will run locally without an external image service. A self-hosted HTTP adapter is planned later. No public hosted API is promised.

## Collections and delivery

| Milestone | Collections / scope |
| --- | --- |
| Phase 0 | Workspace, core engine, test collection and minimal gallery |
| Phase 1 · v0.1 | `mosaic`, `monogram`, `rack`, `siesta`; complete gallery and first package release |
| Phase 2 · v0.2 | `origami`, `pantry`, `deco`, `latte`, `constellation` |
| Phase 3 · v0.3 | `tinbot`, `orbit`, `mission`, `helmet` |
| Phase 4 | React, web component, CLI, self-hosted HTTP adapter and custom palette editor |
| Phase 5 · v1.0 | Stable output contract, complete documentation and release review |

These are planned milestones, not available features. See [PLAN.md](PLAN.md#9-hoja-de-ruta) for deliverables, dependencies and exit criteria.

## Architecture

A pnpm workspace will contain the framework-independent core (`packages/core`), the Vite and vanilla TypeScript gallery (`apps/gallery`), and later thin integration packages. The core will own hashing, deterministic random streams, SVG construction, initials, glyphs and colors. Each collection will own its visual rules, palettes and typed options.

Build tooling: tsup for ESM and declarations, Vitest for tests and output snapshots, Biome for lint and formatting, Changesets for releases, and GitHub Actions for checks. These are development tools, not core runtime dependencies. Tool versions and runtime baselines will be pinned during phase 0.

See [the architecture decisions](docs/ARCHITECTURE.md), including determinism, inline SVG identifiers, package boundaries and publishing rules.

## Contributing and local development

Start with [the guide](PLAN.md), [architecture](docs/ARCHITECTURE.md) and [repository hygiene rules](docs/REPOSITORY_HYGIENE.md). There is no workspace manifest or working install/build/test command yet; phase 0 will add them and update this section with verified commands.

Collection contributions will need original or appropriately licensed artwork, documented options, deterministic snapshots, and visual checks at 24, 32, 64 and 128 px. Do not add private data to fixtures or snapshots.

Only reusable project source, public documentation, reviewed assets, configuration, tests and the lockfile belong in Git. Credentials, internal tools, local assistant configuration, dependencies and build outputs are excluded by [.gitignore](.gitignore). Git ignore rules cannot protect secrets already tracked: inspect staged changes before every commit. Published packages will use an explicit file allowlist and a reviewed package dry run.

## License and permitted uses

The project code, documentation and original avatar artwork are available under [MIT](LICENSE). You may use them for personal, educational, internal and commercial projects, including proprietary applications; modify them; and redistribute or sell copies. There is no requirement to publish your application's source code. Include the copyright and license notice when redistributing copies or substantial portions of the licensed material. The software is provided without warranty.

Generated avatars made entirely from original project artwork may also be used in personal and commercial projects under the same license. Any future third-party glyphs or artwork must retain their own license and notices; MIT does not replace those terms. No third-party font or artwork is included at this stage. License review and required notices are release gates for collections that introduce such assets.

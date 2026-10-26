# lazy-avatars

## 1.1.1

### Patch Changes

- Show all thirteen collections in the npm README using public, commit-pinned
  image URLs. Update core, React, web component, CLI and HTTP examples and document
  migration from deprecated scoped packages. Runtime code and SVG output are unchanged.

## 1.1.0

### Minor Changes

- Add optional integrations via lazy-avatars/react, lazy-avatars/web-component,
  lazy-avatars/cli and lazy-avatars/http, plus lazy-avatars and lazy-avatars-http bins.
  React is an optional peer; the root engine and collection import graphs remain
  free of React, DOM access, Node built-ins and runtime dependencies. Existing SVG
  output and collection outputVersion values are unchanged.
  Migrate imports from the separately published @paulaquiin adapter packages.

## 1.0.0

### Major Changes

- Establish the stable 1.0 API, public collection/theme IDs and output-version
  contract. Core rendering, normalized inputs, defaults and all existing SVG
  snapshots are unchanged from 0.3.0. Every collection retains outputVersion 1.

  Publish the four adapters under the maintainer-owned @paulaquiin scope, replacing
  the provisional @lazy-avatars names used only in unpublished workspace builds.
  Adapters target lazy-avatars ^1.0.0. React 19 remains a peer dependency.

  Add stability/migration guidance, verified compatibility and performance data,
  contribution guidance, original MIT Siesta branding and third-party notices.

## 0.3.0

### Minor Changes

- 855cd5a: Add Hojalata (`tinbot`), Órbita (`orbit`), Misión (`mission`) and Casco (`helmet`)
  as independent typed ESM subpaths, completing the 13-collection catalogue.
  Each includes five original MIT palettes and forceable primary variants.
  Misión includes an original sans path alphabet, without external fonts or agency
  insignia. Planet rings use separate back/front layers; visor and badge artwork
  uses isolated SVG clips.

  The common engine API and the 180 fixed SVG outputs of the nine existing
  collections are unchanged. All collections retain or start at outputVersion 1.

## 0.2.0

### Minor Changes

- 67f5a31: Add five original MIT collections through isolated ESM subpaths: Origami
  (`animal`: fox, cat, bear, owl), Despensa (`food`: donut, citrus, egg, avocado),
  Déco (`motif`: fan, arches, sun), Latte (`art`: heart, tulip, rosetta, rings) and
  Constelación (seeded 4–6-star graphs). Each includes five palettes and validates
  its own options. Main Deco and constellation lines are at least 1 px at 32 px,
  with foreground contrast selected against each palette background.

  The engine API and all existing Mosaic, Monogram, Rack and Siesta snapshot
  outputs remain unchanged. Every collection starts or retains outputVersion 1.

## 0.1.0

### Minor Changes

- Add the first four original collections as separate ESM subpaths: Mosaic,
  Monogram, Rack and Siesta. Each includes typed options, independent palette/trait
  streams, original licensed artwork and outputVersion 1. Preserve the existing
  engine output contract and add package isolation checks for all collection imports.

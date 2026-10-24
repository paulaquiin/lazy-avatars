# lazy-avatars

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

# Stable API and migration / API estable y migración

## English · 1.0 contract

For a fixed package version, collection/outputVersion, normalized seed and
effective options, the generated SVG is byte-identical. The 1.0 rendering code
and all 260 collection snapshots are unchanged from 0.3.0. Each collection keeps
`outputVersion: 1`. The logo is a separate asset and does not alter Siesta.

The public root exports are `createAvatar`, `createAvatarDataUri`, `contrastRatio`,
`normalizeColor`, `readable`, `renderPixelGlyphs`, `hashString`, `normalizeSeed`,
`extractInitials`, `createRng`, `escapeXml`, `svgElement`, `svgNumber` and `themes`.
Public types are `AvatarOptions`, `Collection`, `Palette`, `PaletteInput`,
`RenderContext`, `Shape`, `ThemeId` and `Rng`. Import collections from their
documented subpaths; internal source paths, chunk filenames, build tools and
gallery DOM/CSS are not public import contracts.

Frozen collection IDs: `mosaic`, `monogram`, `rack`, `siesta`, `origami`, `pantry`,
`deco`, `latte`, `constellation`, `tinbot`, `orbit`, `mission`, `helmet`.
Theme IDs: `pastel`, `corporate`, `night`, `earth`, `mono`. Shapes: `square`,
`rounded`, `circle`. The [core README](../packages/core/README.md) specifies input
limits, defaults, option validation, normalization and each collection's options.
Those accepted inputs and defaults form part of the stable contract.

Seeds are trimmed, NFC-normalized and case-sensitive, with 1–1024 UTF-16 code
units after normalization. Hashing uses FNV-1a over UTF-8; it is not encryption,
anonymization or a uniqueness guarantee. Palette roles are exactly `background`,
`primary`, `secondary`, `accent`, `ink`, accepting hex colors. Named RNG streams,
rounding, serialization, artwork and seeded defaults all contribute to output.
Do not mutate collection/theme definitions. Collection renderers are trusted
code; arbitrary third-party SVG is not sanitized by the engine.

### Versioning

- Patch: documentation or implementation corrections that preserve supported
  API behavior and existing SVG bytes for valid inputs.
- Minor: additive API, a new theme or collection, provided existing valid inputs,
  defaults and outputs remain unchanged. Adding a seeded variant can change
  existing output, so it is not automatically a minor change.
- Major: removing/renaming public API or IDs, changing accepted valid inputs or
  defaults, or changing SVG bytes for an existing valid input. Increment each
  affected collection's `outputVersion` and document the visual migration.
- `outputVersion` identifies the renderer contract; it is not a runtime selector
  for old renderers. Pin the package version or store the SVG for archival output.

An explicit `idPrefix` is part of the input and must differ per repeated inline
instance. `<img>` data URIs isolate references. React automatically supplies
instance IDs; use distinct, matching `identifierPrefix` values across independent
SSR/client roots. Explicit prefixes override that automation. A title gives an
SVG an accessible name; without one it is decorative. Status and identity need
appropriate surrounding text, not just avatar appearance or LED color.

### Migration from 0.3.0 and unpublished adapters

```sh
npm install lazy-avatars@1.0.0
```

Core imports, options, normalized inputs and SVGs need no migration. Refresh the
lockfile and retain explicit version pins when byte stability matters. The four
adapters move from provisional, never-published `@lazy-avatars/*` names to:

| Previous workspace name       | Stable package name                      |
| ----------------------------- | ---------------------------------------- |
| `@lazy-avatars/react`         | `@paulaquiin/lazy-avatars-react`         |
| `@lazy-avatars/web-component` | `@paulaquiin/lazy-avatars-web-component` |
| `@lazy-avatars/cli`           | `@paulaquiin/lazy-avatars-cli`           |
| `@lazy-avatars/http`          | `@paulaquiin/lazy-avatars-http`          |

Their APIs retain phase 4 behavior and depend on core `^1.0.0`; React is a peer
dependency `^19.0.0`. The CLI bins remain `lazy-avatars` and `lazy-avatars-http`.
See [integration contracts](INTEGRATIONS.md) and [release status](RELEASING.md)
before using registry installation commands. No hosted public image API exists.

## Español · contrato 1.0

Misma versión fijada del paquete, colección/outputVersion, semilla normalizada y
opciones efectivas producen los mismos bytes SVG. La versión 1.0 conserva el
código de renderizado y los 260 snapshots de 0.3.0; todas las colecciones mantienen
`outputVersion: 1`. El logo es independiente y no modifica Siesta.

Se fijan los exports y tipos públicos indicados arriba, las trece subrutas, los
cinco IDs de temas y las tres formas. Los límites, valores por defecto y opciones
admitidas están en el README del núcleo y forman parte del contrato. Los chunks,
rutas internas y DOM/CSS de la galería no son API pública.

Un parche conserva API, entradas válidas y bytes existentes. Una versión menor
añade API, temas o colecciones sin alterar entradas, valores por defecto o salidas
anteriores. Cambiar bytes para una entrada válida, renombrar/eliminar API o IDs,
o cambiar validación de entradas válidas exige versión mayor. Se incrementa además
el `outputVersion` de las colecciones afectadas y se documenta la migración.
Añadir variantes elegidas por semilla puede alterar salidas y no es necesariamente
un cambio menor. Para conservar imágenes históricas, fijar versión o guardar SVG;
no existe selector de renderizadores anteriores.

Migrar el núcleo desde 0.3.0 solo requiere instalar 1.0.0 y actualizar el lockfile:
no cambian imports, opciones ni SVG. Los adaptadores sin publicar cambian del
scope provisional a los cuatro nombres `@paulaquiin` de la tabla; sus APIs y bins
se mantienen. Usan núcleo `^1.0.0` y React `^19.0.0` como peer cuando corresponde.
Las semillas son sensibles a mayúsculas, se recortan y normalizan a NFC. El hash
puede colisionar y no anonimiza. Prefijos distintos por SVG inline; título para
un nombre accesible y texto adicional para estados. No se sanitizan colecciones
de terceros: sus renderizadores son código de confianza.

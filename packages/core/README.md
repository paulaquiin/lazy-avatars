# lazy-avatars

Dependency-free, deterministic SVG engine. Phase 0, unpublished `0.0.0`.
The themed collections are planned for later phases and are not included yet.

```ts
import { createAvatar, svgElement, themes, type Collection } from 'lazy-avatars';

const dot: Collection = {
  id: 'dot',
  name: 'Dot example',
  outputVersion: 1,
  palettes: themes.pastel,
  usesInitials: false,
  render: ({ palette }) => svgElement('circle', { cx: 40, cy: 40, r: 24, fill: palette.primary }),
};

const svg = createAvatar(dot, { seed: 'demo-person-01', title: 'Demo person' });
```

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

Code, documentation and original pixel glyphs: MIT; preserve the included license
when redistributing copies or substantial portions. No third-party font is bundled.

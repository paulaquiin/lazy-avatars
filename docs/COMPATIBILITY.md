# Compatibility, accessibility and measurements / Compatibilidad y medidas

## Verified baseline / Base verificada

| Environment / Entorno          | Evidence / Evidencia                  | Scope / Alcance                                                                          |
| ------------------------------ | ------------------------------------- | ---------------------------------------------------------------------------------------- |
| Windows x64, Node 24.21        | Local release preparation; CI Node 24 | ESM, types, SVG, tarballs, CLI/HTTP                                                      |
| Linux, Node 24.11 and 26       | CI matrix                             | Same checks plus Chromium                                                                |
| Chromium, Playwright 1.64.1    | Browser parity and integration checks | Thirteen collections, Unicode, URL state, mobile layout, React hydration, custom element |
| React / React DOM 19.3.1       | SSR and browser hydration             | Repeated instances, unique IDs, accessible/decorative SVG, state updates                 |
| Docker Linux, Node 24.21 image | CI container smoke test               | Non-root/read-only startup, health, SVG MIME/bytes, invalid inputs                       |

Results apply to the checked commit and pinned lockfile. Node engines are
`^24.11.0 || >=26.0.0`, React peer support is `^19.0.0`; the rows identify versions
actually exercised. Deno, Bun, edge runtimes, other browsers and screen readers
are not certified by this matrix. No CommonJS build is provided. Core has no DOM,
Node built-ins, remote assets, fonts or runtime dependencies. Adapters have their
own platform requirements; see [INTEGRATIONS.md](INTEGRATIONS.md).

Los resultados corresponden al commit comprobado y al lockfile fijado. Los rangos
de engines/peers no equivalen a probar todas sus versiones. Deno, Bun, edge, otros
navegadores y lectores de pantalla no están certificados. El núcleo es ESM sin
dependencias de ejecución; cada adaptador declara sus requisitos de plataforma.

## Accessibility / Accesibilidad

SVGs with a title use `role="img"` and a title reference; otherwise they are marked
decorative. Inline repeats need distinct IDs; React automates this, while custom
elements isolate references in shadow roots. Use alt text for `<img>` and text
alongside meaningful status LEDs. The target is recognizable silhouettes at 32 px;
24 px is a stress test where small glyphs/details simplify. Palette contrast helpers
target 3:1, not complete WCAG conformance. Custom colors and transparent surfaces
need application-level review. Keyboard/browser checks do not replace an assistive
technology audit. Earlier visual reviews cover all thirteen collections.

Con título, el SVG tiene nombre accesible; sin título es decorativo. Las imágenes
necesitan alt apropiado y los estados, texto además de color. Revisar contraste
con colores personalizados y sobre el fondo real. Objetivo visual: 32 px; detalles
pequeños se pierden a 24 px. Las comprobaciones actuales no certifican conformidad
WCAG ni sustituyen una revisión con tecnologías de asistencia.

## Size and performance / Tamaño y rendimiento

One manual measurement on 2026-10-24: Node 24.21, Windows x64, 100 warmups then
1000 distinct seeds per collection, 32 px, default options/palettes, no title.
`pnpm benchmark` reproduces the method after build. This is a sampled observation,
not a timing test, service capacity estimate or cross-machine guarantee.

Una medición manual, no una suite nueva: 100 calentamientos y 1000 semillas por
colección. Los tiempos dependen del equipo y su carga; tamaños de la muestra,
no máximos garantizados para títulos o entradas arbitrarias.

| Collection    | µs/avatar | Mean SVG bytes | Max sampled bytes | Ada Moss gzip bytes |
| ------------- | --------: | -------------: | ----------------: | ------------------: |
| mosaic        |     374.2 |           2305 |              2851 |                 356 |
| monogram      |     279.7 |            743 |               782 |                 426 |
| rack          |     702.6 |           1884 |              1997 |                 557 |
| siesta        |     593.4 |            960 |              1092 |                 452 |
| origami       |     234.7 |            842 |               857 |                 410 |
| pantry        |     418.7 |            897 |              1406 |                 458 |
| deco          |     215.2 |            808 |               914 |                 450 |
| latte         |     262.4 |            974 |              1201 |                 552 |
| constellation |     876.3 |           1204 |              1284 |                 464 |
| tinbot        |     417.6 |           1441 |              1627 |                 471 |
| orbit         |     369.4 |           1237 |              1732 |                 495 |
| mission       |     788.0 |           1961 |              2077 |                 675 |
| helmet        |     315.2 |           1458 |              1737 |                 577 |

Core reachable ESM: 16 380 bytes raw / 5 408 gzip; budget 24 KiB / 8 KiB.
Collections are separate imports. CI checks sizes and isolated package import
graphs. React is not bundled into the core or the framework-free gallery.
No rendering performance threshold was added to CI, avoiding noisy timing failures.

## Single-package 1.1 preparation / Preparación 1.1

The npm archive now contains all integration entries, but root imports stay isolated.
Measured reachable engine: 16 517 bytes ESM / 5 411 gzip, within the unchanged
24 KiB / 8 KiB budget. No React/DOM/Node server imports enter core/collection graphs.
El tarball incluye más entradas; el motor importado sigue siendo ligero. No se
repitió el benchmark de renderizado: los algoritmos y los SVG no cambian.

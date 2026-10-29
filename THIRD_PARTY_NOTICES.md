# Third-party notices / Avisos de terceros

Project source, generated collection artwork, all glyphs and the Siesta brand
assets are original material under the root MIT license. No converted font outline,
agency insignia or external illustration is distributed.
The gallery website self-hosts Arima Madurai and Mulish under the SIL Open Font
License 1.1. Their copyright and full license texts are in
`apps/gallery/public/fonts/OFL-arima-madurai.txt` and
`apps/gallery/public/fonts/OFL-mulish.txt`. These fonts are not embedded in
avatar SVG output or the published core package.
The core has zero runtime dependencies. CLI/HTTP and the web component ship as isolated entries in the same MIT package.
React is an optional peer dependency, never bundled here.

Consumers installing React/React DOM receive those packages with their own MIT
license and copyright notices; retain them when redistributing their code.
Development tooling is not part of the published avatar runtime. Its individual
licenses remain in installed packages, including MIT for React, React DOM, Vite,
Vitest, tsup, esbuild, Changesets and fast-xml-parser; Apache-2.0 for TypeScript and
Playwright; and MIT OR Apache-2.0 for Biome. Type declarations retain their own
package notices. The pinned Node/Debian Docker base retains its upstream component
licenses and notices; its operating-system components are not relicensed as MIT
by this project. No extra third-party code or art is vendored into the core.

El código, arte, glifos y marca Siesta son originales MIT. La web distribuye
Arima Madurai y Mulish con licencia SIL OFL 1.1 y sus avisos en `apps/gallery/public/fonts`.
Los avatares SVG y el paquete principal no incluyen estas fuentes. No se distribuyen
ilustraciones externas ni insignias de agencias. Núcleo sin dependencias de
ejecución; adaptadores sin copias embebidas del motor ni de React. Las dependencias
instaladas conservan sus avisos y licencias, que deben mantenerse al redistribuir
su código. Herramientas de desarrollo y componentes de la imagen Node/Debian
conservan sus términos originales y no pasan a ser MIT por pertenecer al entorno
de este proyecto. La revisión de distribución comprueba inventarios positivos.

# lazy-avatars

Avatares SVG deterministas para personas, equipos, servidores y bots. Una semilla y una colección temática, sin almacenar imágenes.

[English](README.md) · [Arquitectura](docs/ARCHITECTURE.md) · [Guía y fases](PLAN.md) · [Licencia MIT](LICENSE)

> **Estado: fase 0 implementada localmente, versión `0.0.0` sin publicar.** Funcionan el motor determinista, las herramientas, las pruebas y la galería mínima del workspace. Las 13 colecciones temáticas siguen pendientes. El CI se ejecuta en GitHub con cada push y pull request; consulta [sus resultados](https://github.com/paulaquiin/lazy-avatars/actions/workflows/ci.yml). Los nombres propuestos devolvieron 404 en el registro el 2026-10-23; eso no reserva los nombres ni acredita la propiedad del scope.

## Qué vamos a construir

- Una librería TypeScript que devuelve SVG en texto, sin dependencias de ejecución en el núcleo.
- El mismo SVG para la misma colección, versión de salida, semilla normalizada y opciones de renderizado.
- Colecciones importables por separado para cargar solo las que se utilizan.
- Un lienzo `80 × 80`, formas configurables, fondo transparente opcional y cinco roles de color comunes a colecciones y temas.
- Iniciales dibujadas mediante paths o píxeles, sin fuentes del sistema ni recursos remotos.
- Una galería estática para revisar semillas, tamaños, temas y ejemplos dentro de interfaces. El tamaño mínimo objetivo es 32 px; 24 px sirve como prueba visual exigente.

La verificación local cubre Node 24.21 y Chromium en Windows. El CI contempla Node 24.11 (mínimo) y Node 26 en Linux, y Node 24 en Windows. Deno, Bun y entornos edge siguen siendo objetivos cuya compatibilidad se comprobará antes de prometer soporte.

## API funcional del motor

Compila primero el workspace. Este ejemplo utiliza la API implementada con una colección definida por la aplicación; las subrutas como `lazy-avatars/rack` llegarán en fase 1. No instales todavía ese nombre desde npm: este proyecto no ha publicado ningún paquete.

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
  name: 'Ejemplo de punto',
  outputVersion: 1,
  palettes: themes.pastel,
  usesInitials: false,
  render: ({ palette }) => svgElement('circle', { cx: 40, cy: 40, r: 24, fill: palette.primary }),
};

const svg = createAvatar(dot, {
  seed: 'persona-demo-01',
  size: 64,
  shape: 'rounded',
  title: 'Persona de ejemplo',
});

const src = createAvatarDataUri(dot, { seed: 'persona-demo-01' });
// Usar src en un <img> con un alt adecuado.
```

La semilla se normaliza con `trim()` y Unicode NFC, respetando mayúsculas: `Ana` y `ana` son distintas. Se rechazan las semillas vacías. Si tu aplicación considera equivalentes los emails con distintas mayúsculas, conviértelos a minúsculas antes de pasarlos. Usa identificadores ficticios: el hash determinista no anonimiza. Cuando la fase 1 incorpore estado en la URL de la galería, compartirla expondrá su semilla.

La generación es local, sin un servicio externo de imágenes. Más adelante habrá un adaptador HTTP autoalojable; no se promete una API pública alojada por el proyecto. El [contrato del núcleo](packages/core/README.md) detalla los valores por defecto, validación, renderizadores de confianza y requisitos de `idPrefix` para SVG inline.

## Colecciones y fases

| Hito          | Colecciones / alcance                                                          |
| ------------- | ------------------------------------------------------------------------------ |
| Fase 0        | Workspace, motor, colección de prueba y galería mínima                         |
| Fase 1 · v0.1 | `mosaic`, `monogram`, `rack`, `siesta`; galería completa y primera publicación |
| Fase 2 · v0.2 | `origami`, `pantry`, `deco`, `latte`, `constellation`                          |
| Fase 3 · v0.3 | `tinbot`, `orbit`, `mission`, `helmet`                                         |
| Fase 4        | React, web component, CLI, adaptador HTTP autoalojable y editor de paletas     |
| Fase 5 · v1.0 | Contrato de salida estable, documentación completa y revisión de lanzamiento   |

La fase 0 está implementada y verificada localmente; los resultados remotos están enlazados arriba. Las fases 1–5 son futuras. Los entregables, dependencias y criterios de cierre están en [PLAN.md](PLAN.md#9-hoja-de-ruta). La colección de prueba es solo de desarrollo y queda fuera del paquete npm.

## Arquitectura

El monorepo pnpm contiene el núcleo independiente de frameworks en `packages/core` y la galería con Vite y TypeScript sin framework en `apps/gallery`. Los adaptadores llegarán en fases posteriores. El núcleo resuelve hash, aleatoriedad determinista, SVG, iniciales, glifos de píxel propios y color. Cada colección futura contendrá sus reglas visuales, paletas y opciones tipadas.

Usamos tsup para ESM y tipos, Vitest para pruebas y snapshots, Playwright para paridad en Chromium y pruebas de galería, Biome para lint y formato, Changesets para versiones y GitHub Actions para comprobaciones. Son herramientas de desarrollo, no dependencias de ejecución del núcleo. Las versiones exactas están fijadas en `package.json` y `pnpm-lock.yaml`.

Consulta [las decisiones de arquitectura](docs/ARCHITECTURE.md), incluida la estabilidad de salida, los identificadores SVG, los límites entre paquetes y la publicación.

## Desarrollo y contribuciones

Requiere Node `^24.11.0 || >=26.0.0` y pnpm `11.25.0`. Con pnpm instalado:

```sh
pnpm install --frozen-lockfile
pnpm exec playwright install chromium
pnpm check
pnpm dev
```

En Linux, usa `pnpm exec playwright install --with-deps chromium` para instalar también las dependencias del sistema del navegador. `pnpm dev` inicia la galería en la URL que imprime Vite (normalmente `http://127.0.0.1:5173`). Muestra únicamente la figura de prueba del motor.

Comandos individuales: `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`, `pnpm check:repo`, `pnpm check:package`, `pnpm test:browser`. Compila antes de comprobar el paquete/navegador. Los comandos de tipos y desarrollo compilan el núcleo automáticamente. `pnpm check` los ejecuta en el orden necesario. `pnpm format` aplica formato y arreglos seguros del linter. `pnpm changeset` registra cambios de API o salida pública.

Empieza por [la guía](PLAN.md), [la arquitectura](docs/ARCHITECTURE.md) y [las reglas del repositorio](docs/REPOSITORY_HYGIENE.md). La comprobación incluye 38 pruebas unitarias, un snapshot de 20 semillas, inventario del paquete y prueba de instalación/tipos aislada, además de dos tests en Chromium. Los presupuestos iniciales del núcleo son 24 KiB ESM y 8 KiB gzip; el objetivo orientativo por SVG es 4 KiB. El CI no publica automáticamente ni requiere secretos del repositorio.

Cada colección necesitará arte original o con licencia compatible, opciones documentadas, snapshots deterministas y revisión visual a 24, 32, 64 y 128 px. Las pruebas y capturas deben usar datos ficticios.

Git contiene código reutilizable, documentación pública, recursos revisados, configuración, pruebas y el lockfile. El [.gitignore](.gitignore) excluye credenciales, herramientas internas, configuración local de asistentes, dependencias y resultados de compilación. Los scripts públicos de `scripts/` permiten reproducir el CI y forman parte del proyecto. Las exclusiones no protegen secretos ya versionados: hay que revisar cada commit. El comprobador examina rutas, patrones habituales de credenciales y el historial Git disponible sin imprimir valores; no sustituye una auditoría exhaustiva. El paquete tiene una lista positiva de cinco archivos, contrastada con el contenido real del pack.

## Licencia: qué se puede hacer

El código, la documentación y el arte original del proyecto se distribuyen bajo [MIT](LICENSE). Se pueden usar en proyectos personales, educativos, internos y comerciales, incluidas aplicaciones privativas; modificar, redistribuir y vender copias. No es obligatorio publicar el código de tu aplicación. Al redistribuir copias o partes sustanciales del material licenciado, hay que conservar el aviso de copyright y la licencia. Se proporciona sin garantía.

Los avatares generados íntegramente con arte original del proyecto también se pueden usar en proyectos personales y comerciales bajo esa licencia. Si incorporamos glifos o ilustraciones de terceros, conservarán sus propias condiciones y avisos; MIT no los sustituye. Actualmente no se distribuyen fuentes ni ilustraciones de terceros. Revisar sus licencias e incluir sus avisos será obligatorio antes de publicar las colecciones afectadas.

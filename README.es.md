# lazy-avatars

Avatares SVG deterministas para personas, equipos, servidores y bots. Una semilla y una colección temática, sin almacenar imágenes.

[English](README.md) · [Arquitectura](docs/ARCHITECTURE.md) · [Guía y fases](PLAN.md) · [Licencia MIT](LICENSE)

> **Estado: planificación, sin implementación.** El repositorio contiene la guía y la documentación. Todavía no proporciona una librería funcional, una galería publicada ni una versión distribuida. Los nombres de paquetes son provisionales hasta comprobar su disponibilidad. La API que aparece debajo es una propuesta y aún no se puede ejecutar.

## Qué vamos a construir

- Una librería TypeScript que devuelve SVG en texto, sin dependencias de ejecución en el núcleo.
- El mismo SVG para la misma colección, versión de salida, semilla normalizada y opciones de renderizado.
- Colecciones importables por separado para cargar solo las que se utilizan.
- Un lienzo `80 × 80`, formas configurables, fondo transparente opcional y cinco roles de color comunes a colecciones y temas.
- Iniciales dibujadas mediante paths o píxeles, sin fuentes del sistema ni recursos remotos.
- Una galería estática para revisar semillas, tamaños, temas y ejemplos dentro de interfaces. El tamaño mínimo objetivo es 32 px; 24 px sirve como prueba visual exigente.

El objetivo es funcionar en navegador, Node.js, Deno, Bun y entornos edge. Esa compatibilidad se verificará antes de publicar; todavía no está implementada.

## Uso previsto

**API propuesta; estará disponible tras su implementación y publicación:**

```ts
import { createAvatar, createAvatarDataUri } from 'lazy-avatars';
import { rack } from 'lazy-avatars/rack';

const svg = createAvatar(rack, {
  seed: 'servidor-demo-01',
  size: 64,
  shape: 'rounded',
  title: 'Servidor de ejemplo — advertencia',
  options: { status: 'warn' },
});

const src = createAvatarDataUri(rack, { seed: 'servidor-demo-01' });
// Tras implementarlo: usar src en un <img> con un alt adecuado.
```

La semilla se normalizará con `trim()` y Unicode NFC, respetando mayúsculas: `Ana` y `ana` serán distintas. Si tu aplicación considera equivalentes los emails con distintas mayúsculas, conviértelos a minúsculas antes de pasarlos. Usa identificadores ficticios en ejemplos y enlaces de la galería: el hash determinista no anonimiza y la URL compartida expone la semilla.

La generación será local, sin un servicio externo de imágenes. Más adelante habrá un adaptador HTTP autoalojable; no se promete una API pública alojada por el proyecto.

## Colecciones y fases

| Hito | Colecciones / alcance |
| --- | --- |
| Fase 0 | Workspace, motor, colección de prueba y galería mínima |
| Fase 1 · v0.1 | `mosaic`, `monogram`, `rack`, `siesta`; galería completa y primera publicación |
| Fase 2 · v0.2 | `origami`, `pantry`, `deco`, `latte`, `constellation` |
| Fase 3 · v0.3 | `tinbot`, `orbit`, `mission`, `helmet` |
| Fase 4 | React, web component, CLI, adaptador HTTP autoalojable y editor de paletas |
| Fase 5 · v1.0 | Contrato de salida estable, documentación completa y revisión de lanzamiento |

Son hitos previstos, no funcionalidades disponibles. Los entregables, dependencias y criterios de cierre están en [PLAN.md](PLAN.md#9-hoja-de-ruta).

## Arquitectura

Montaremos un monorepo con pnpm: núcleo independiente de frameworks en `packages/core`, galería con Vite y TypeScript sin framework en `apps/gallery`, y adaptadores separados en fases posteriores. El núcleo resolverá hash, aleatoriedad determinista, SVG, iniciales, glifos y color. Cada colección contendrá sus reglas visuales, paletas y opciones tipadas.

Usaremos tsup para ESM y tipos, Vitest para pruebas y snapshots, Biome para lint y formato, Changesets para versiones y GitHub Actions para comprobaciones. Son herramientas de desarrollo, no dependencias de ejecución del núcleo. Las versiones y los mínimos de los runtimes se fijarán en la fase 0.

Consulta [las decisiones de arquitectura](docs/ARCHITECTURE.md), incluida la estabilidad de salida, los identificadores SVG, los límites entre paquetes y la publicación.

## Desarrollo y contribuciones

Empieza por [la guía](PLAN.md), [la arquitectura](docs/ARCHITECTURE.md) y [las reglas del repositorio](docs/REPOSITORY_HYGIENE.md). Aún no hay manifiestos del workspace ni comandos funcionales de instalación, build o tests; la fase 0 los añadirá y documentará después de verificarlos.

Cada colección necesitará arte original o con licencia compatible, opciones documentadas, snapshots deterministas y revisión visual a 24, 32, 64 y 128 px. Las pruebas y capturas deben usar datos ficticios.

Git contendrá código reutilizable, documentación pública, recursos revisados, configuración, pruebas y el lockfile. El [.gitignore](.gitignore) excluye credenciales, herramientas internas, configuración local de asistentes, dependencias y resultados de compilación. No protege secretos que ya estén versionados: hay que revisar los cambios preparados antes de cada commit. Los paquetes publicados tendrán una lista explícita de archivos permitidos y se revisará su contenido antes de distribuirlos.

## Licencia: qué se puede hacer

El código, la documentación y el arte original del proyecto se distribuyen bajo [MIT](LICENSE). Se pueden usar en proyectos personales, educativos, internos y comerciales, incluidas aplicaciones privativas; modificar, redistribuir y vender copias. No es obligatorio publicar el código de tu aplicación. Al redistribuir copias o partes sustanciales del material licenciado, hay que conservar el aviso de copyright y la licencia. Se proporciona sin garantía.

Los avatares generados íntegramente con arte original del proyecto también se pueden usar en proyectos personales y comerciales bajo esa licencia. Si incorporamos glifos o ilustraciones de terceros, conservarán sus propias condiciones y avisos; MIT no los sustituye. Actualmente no se distribuyen fuentes ni ilustraciones de terceros. Revisar sus licencias e incluir sus avisos será obligatorio antes de publicar las colecciones afectadas.

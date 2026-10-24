# lazy-avatars · Plan de implementación

> **Estado:** fase 5 en preparación: cinco candidatos 1.0.0, contrato estable, migración, compatibilidad, contribuciones y marca Siesta MIT. Scope @paulaquiin aprobado para adaptadores. Publicación y verificación npm pendientes; núcleo 0.3.0 aún publicado.
> **Última actualización:** 2026-10-24
>
> Documentos relacionados: [README en español](README.es.md), [README principal](README.md), [arquitectura](docs/ARCHITECTURE.md) y [reglas de Git y publicación](docs/REPOSITORY_HYGIENE.md).

## 1. Qué es lazy-avatars

Una librería open source que genera avatares SVG a partir de un texto: un nombre, un email, un hostname. El mismo texto produce siempre el mismo avatar, así que no hace falta guardar imágenes: basta con el nombre.

Está pensada para entornos de trabajo: personas y equipos en herramientas internas, pero también servidores, servicios, bots y runners de CI.

Lo que lo hace distinto son sus colecciones temáticas, cada una con personalidad propia.

### Principios

- **Determinista.** Misma colección + misma versión de salida + misma semilla normalizada + mismas opciones efectivas = mismo SVG, byte a byte.
- **Sin dependencias** en el núcleo. Devuelve un SVG en texto, así que funciona en navegador, Node, Deno, Bun y entornos edge.
- **Perezoso de usar** (de ahí el nombre): una línea y cero configuración. Todo lo demás es opcional.
- **Legible en pequeño.** Cada colección tiene que funcionar a 32 px, que es el tamaño real de un avatar en una lista.
- **Ligero.** Cada colección se importa por separado y el SVG generado pesa poco.
- **Autónomo.** Sin fuentes externas ni recursos remotos: el SVG se ve igual en cualquier sitio.

## 2. Las colecciones (13)

| #   | Colección    | id              | Grupo    | Tema                 | Iniciales  | Fase |
| --- | ------------ | --------------- | -------- | -------------------- | ---------- | ---- |
| 1   | Monograma    | `monogram`      | Clásica  | Corporativo          | Sí         | 1    |
| 2   | Origami      | `origami`       | Clásica  | Animales             | No         | 2    |
| 3   | Despensa     | `pantry`        | Clásica  | Comida               | No         | 2    |
| 4   | Mosaico      | `mosaic`        | Clásica  | Geométrico           | No         | 1    |
| 5   | Déco         | `deco`          | Clásica  | Chic y vintage       | No         | 2    |
| 6   | Siesta       | `siesta`        | Original | Mascota del proyecto | No         | 1    |
| 7   | Rack         | `rack`          | Original | Servidores y bots    | Sí (LCD)   | 1    |
| 8   | Latte        | `latte`         | Original | Pausa café           | No         | 2    |
| 9   | Hojalata     | `tinbot`        | Original | Robots de juguete    | No         | 3    |
| 10  | Constelación | `constellation` | Espacial | Cielo nocturno       | No         | 2    |
| 11  | Órbita       | `orbit`         | Espacial | Planetas             | No         | 3    |
| 12  | Misión       | `mission`       | Espacial | Parches de misión    | Sí (cinta) | 3    |
| 13  | Casco        | `helmet`        | Espacial | Astronautas          | No         | 3    |

Descartada: **Señales** (iniciales codificadas con banderas del código marítimo internacional).

### 2.1 Clásicas con giro propio

#### Monograma · `monogram`

Iniciales con serifa dentro de un sello. Para directorios, intranets y herramientas corporativas.
- **Varía:** el marco (círculo doble, escudo, rombo) y la paleta.
- **Paletas:** azul marino, burdeos, verde inglés y grafito combinados con hueso u oro viejo, más sus inversas.
- **Ojo:** las letras se dibujan como paths (ver §4.4), no con fuentes del sistema.

#### Origami · `origami`

Cabezas de animales hechas con triángulos, a dos tonos (luz y sombra) para dar efecto de papel plegado.
- **Varía:** el animal (zorro, gato, oso, búho; ampliable a pingüino, conejo, mapache, rana), el pelaje según el animal y el fondo pastel.
- **Opciones propias:** `animal` para forzar uno.

#### Despensa · `pantry`

Comida vista desde arriba, en plano.
- **Varía:** el alimento (donut, cítrico cortado, huevo frito, aguacate; ampliable a sandía, galleta, sushi, tostada), el glaseado, las virutas, el número de gajos y la posición de la yema.
- **Opciones propias:** `food`.
- **Ojo:** los detalles pequeños (virutas) se pierden a 24 px; limitar su número.

#### Mosaico · `mosaic`

Teselas Truchet en una cuadrícula de 4×4.
- **Varía:** el tipo de tesela (arcos o triángulos), la orientación de cada una de las 16 teselas y la paleta bicolor.
- **Ojo:** es la colección más simple, así que se usa para validar el motor en la fase 1.

#### Déco · `deco`

Art déco: líneas doradas, simetría y marco fino.
- **Varía:** el motivo (abanico, arcos escalonados, sol radiante), el número de rayos y la paleta (dorado sobre azul noche, negro, verde esmeralda o burdeos; tinta sobre crema).
- **Opciones propias:** `motif`.
- **Ojo:** las líneas finas desaparecen en pequeño; fijar un grosor mínimo.

### 2.2 Originales

#### Siesta · `siesta`

Criaturas blanditas medio dormidas. Es la colección que da sentido al nombre _lazy_ y la candidata a mascota y logo del proyecto.
- **Varía:** el color de la criatura, el accesorio (gorro de dormir, «zzz», antifaz, manta), la boca y el fondo.
- **Opciones propias:** `accessory`.

#### Rack · `rack`

Paneles frontales de servidor con tres unidades. Pensada para hosts, servicios, bots y runners de CI.
- **Varía:** el chasis (grafito, beige retro, azul, negro), el tipo de unidad (bahías de disco, rejilla), los LEDs y una pantalla LCD con las iniciales.
- **Opciones propias:** `status` (`'ok' | 'warn' | 'down' | 'off'`) fija el color de los LEDs. Es la única colección con una opción que transmite información.
- **Ojo:** el texto del LCD usa una fuente de 7 segmentos o de píxel hecha con rectángulos.

#### Latte · `latte`

Una taza vista desde arriba con arte latte.
- **Varía:** el dibujo (corazón, tulipán, roseta, anillos), el color de la cerámica y la superficie de la mesa.
- **Opciones propias:** `art`.

#### Hojalata · `tinbot`

Robots de juguete de hojalata de los años 50: remaches, brillo de chapa y antenas.
- **Varía:** el color de la chapa, la antena (una, dos, cúpula), los ojos (manómetros, visor, desparejados), la dirección de la mirada y la boca (rejilla, sonrisa, puntos).

### 2.3 Familia espacial

Cuatro colecciones comparten tema. Para que no se confundan entre sí:
- **Constelación** es lineal y minimalista.
- **Órbita** es color y volumen.
- **Casco** es un personaje.
- **Misión** va sobre fondo claro y tiene forma de insignia.

En la web se pueden presentar juntas como un pack.

#### Constelación · `constellation`

Cada semilla dibuja su propia constelación sobre un cielo nocturno.
- **Varía:** el número de estrellas (4–6), sus posiciones, el trazo que las une, las estrellas de fondo y el color del cielo.
- **Idea futura:** generar también un nombre para cada constelación.

#### Órbita · `orbit`

Planetas con o sin anillo.
- **Varía:** el tamaño y el color del planeta, franjas o cráteres, el anillo y su inclinación, y una luna.

#### Misión · `mission`

Parches de misión al estilo de las agencias espaciales. Encaja con equipos y proyectos.
- **Varía:** los colores del borde y del campo, el planeta de la parte inferior, la órbita, la inclinación del cohete y las estrellas.
- **Iniciales:** sobre una cinta, en una letra de palo seco.

#### Casco · `helmet`

Un astronauta con un planeta reflejado en el visor.
- **Varía:** el color del traje, la forma del visor, el planeta reflejado, la antena y el fondo (claro u oscuro).

## 3. API del motor y colecciones previstas

`createAvatar`, `createAvatarDataUri`, contratos y helpers ya están implementados. El ejemplo siguiente usa **Rack, ya implementada**, desde la subruta pública `lazy-avatars/rack`. Para un ejemplo ejecutable con una colección propia, ver [README.es.md](README.es.md#api-funcional-del-motor) y [el contrato completo del núcleo](packages/core/README.md).

```ts
import { createAvatar, createAvatarDataUri } from 'lazy-avatars';
import { rack } from 'lazy-avatars/rack';

const svg = createAvatar(rack, {
  seed: 'prod-db-01', // obligatorio
  size: 64, // px, por defecto 64
  shape: 'rounded', // 'square' | 'rounded' | 'circle'
  title: 'prod-db-01', // <title> accesible (opcional)
  background: true, // false = fondo transparente
  palette: 'night', // tema, paleta o lista de paletas (opcional)
  idPrefix: 'server-row-01', // espacio de nombres único por instancia inline (opcional)
  options: { status: 'warn' }, // opciones propias de cada colección
});

const src = createAvatarDataUri(rack, { seed: 'prod-db-01' }); // para <img src>
```

Regla general para las colecciones: cada variante principal se podrá forzar con `options`; el resto se deja al azar determinista. `idPrefix` ya forma parte de la API implementada; para SVG inline con referencias internas se debe proporcionar uno diferente por instancia. Un `<img>` con data URI aísla cada SVG y no requiere ese espacio de nombres documental. Las colecciones pueden validar nombres, valores y defaults con `validateOptions`. Los [tipos implementados](packages/core/src/types.ts) son la referencia precisa del contrato.

### Contrato de una colección

```ts
export interface Collection<O = Record<string, never>> {
  id: string; // 'rack'
  name: string; // 'Rack'
  outputVersion: number; // sube cuando cambia el SVG de una semilla existente
  palettes: Palette[];
  usesInitials: boolean;
  render(ctx: RenderContext<O>): string; // contenido de un lienzo de 80×80
}

export interface RenderContext<O> {
  rng: Rng; // generador con sub-flujos: rng.fork('eyes')
  seed: string;
  initials: string; // ya normalizadas, 1–2 caracteres
  palette: Palette;
  options: Partial<O>;
  id: (name: string) => string; // ids locales estables; aislamiento según idPrefix
}

export interface Palette {
  background: string;
  primary: string;
  secondary: string;
  accent: string;
  ink: string;
}
```

### Paletas y temas

Cada colección pinta con cinco **roles** de color, no con colores fijos:

| Rol          | Uso                                         |
| ------------ | ------------------------------------------- |
| `background` | Fondo                                       |
| `primary`    | Forma principal (cuerpo, chasis, teselas)   |
| `secondary`  | Sombras y variaciones de la forma principal |
| `accent`     | Detalles (accesorios, luces, adornos)       |
| `ink`        | Trazos finos, ojos y letras                 |
- **Paletas propias:** cada colección trae las suyas y la semilla elige una con su propio sub-flujo. Así, cambiar de paleta no cambia la forma del avatar.
- **Temas globales:** listas de paletas que sirven para cualquier colección. Los iniciales son Pastel (`pastel`), Corporativo (`corporate`), Noche (`night`), Tierra (`earth`) y Monocromo (`mono`). Los IDs públicos están en inglés; las etiquetas se pueden traducir. El registro de temas se separa del objeto `Palette` de cinco roles.
- **Contraste:** el motor ofrece `readable(fondo, ...candidatos)`, que devuelve el primer color con contraste ≥ 3:1 (el criterio WCAG para elementos gráficos). Las colecciones lo usan para ojos, letras y trazos, y así funcionan con cualquier tema.
- **Colores con significado:** los LEDs de estado de Rack no cambian con el tema.

## 4. Motor (núcleo)

### 4.1 De la semilla a un número

- Normalización implementada: `trim` + Unicode NFC, conservando mayúsculas. Se rechazan semillas vacías o de más de 1024 unidades UTF-16 tras normalizar.
- Hash FNV-1a de 32 bits sobre los bytes UTF-8 de `` `${collection.id}:${seed}` ``. Al incluir el id, el mismo nombre da avatares independientes en cada colección. Se fijarán vectores ASCII y Unicode. Puede haber colisiones: no se garantiza un avatar distinto para toda identidad ni anonimización.

### 4.2 Aleatoriedad determinista

- PRNG `mulberry32`: pequeño, rápido y suficiente para esto.
- **Sub-flujos por rasgo:** `rng.fork('eyes')` deriva un generador del hash uint32 raíz y la ruta completa del sub-flujo, serializados como `[root, path]` en JSON y hasheados con FNV-1a. No consume el padre. Así, añadir una variante nueva de ojos no cambia el color de fondo de todas las semillas que ya existen. Su comportamiento está fijado con pruebas desde fase 0.
- Helpers: `pick`, `range`, `int`, `chance`, `weighted`.

### 4.3 Construcción del SVG

- Lienzo fijo de 80×80 (`viewBox`) que se escala con `width` y `height`.
- Helpers para crear elementos y escapar texto.
- Redondeo a 1 decimal: la salida es estable y más corta.
- **Ids estables y aislamiento explícito:** evitar referencias cuando sea posible. Si hacen falta, el prefijo predeterminado deriva de la identidad completa de renderizado, incluidas sus opciones. Eso no distingue dos instancias iguales: en SVG inline el llamador debe aportar un `idPrefix` diferente por instancia. No usar contadores globales ni aleatoriedad en el núcleo. Ver [arquitectura, §4](docs/ARCHITECTURE.md#4-identificadores-svg-e-integración-inline).
- `shape` (cuadrado, redondeado, círculo) se aplica en el envoltorio común, no en cada colección.

### 4.4 Iniciales y letras

- Extracción: separar por espacios, `.`, `_` y `-`; quitar acentos; dos caracteres; mayúsculas. Ejemplos: `Ana García` → `AG`, `prod-db-01` → `PD`, `bruno` → `BR`.
- **Las letras se dibujan como paths**, nunca con `<text>`, para no depender de las fuentes instaladas:
  - Rack: 7 segmentos o píxel, de diseño propio.
  - Monograma: serif.
  - Misión: palo seco.
- Si una inicial no tiene glifo (por ejemplo, nombres en alfabetos no latinos), la colección pone un símbolo neutro en su lugar.

### 4.5 Contrato de estabilidad

- Cambiar el SVG que produce una semilla existente es un cambio incompatible: se sube `outputVersion` de la colección y la versión mayor del paquete.
- Los tests de snapshot lo detectan.
- Antes de la 1.0 se permite, pero se anota en el CHANGELOG.
- `outputVersion` también se actualiza antes de 1.0 cuando cambia la salida. No permite seleccionar renderizadores históricos: para conservarlos hay que fijar la versión del paquete o almacenar el SVG.

## 5. Estructura del repositorio y tecnologías

```
lazy-avatars/
├── packages/
│   ├── core/              # paquete npm «lazy-avatars»: motor + colecciones
│   │   └── src/
│   │       ├── index.ts
│   │       ├── engine/        # hash, prng, svg, initials, glyphs, color
│   │       ├── themes/        # temas globales
│   │       └── collections/
│   │           └── rack/      # index.ts, palettes.ts, README.md, snapshots
│   ├── react/             # @paulaquiin/lazy-avatars-react (fase 4)
│   ├── web-component/     # <lazy-avatar> (fase 4)
│   ├── cli/               # @paulaquiin/lazy-avatars-cli (fase 4)
│   └── http/              # adaptador autoalojable + Dockerfile (fase 4)
├── apps/
│   └── gallery/           # galería y banco de pruebas (GitHub Pages)
├── docs/
├── PLAN.md
├── LICENSE
├── README.md
└── README.es.md
```

Cada colección sale como subruta (`lazy-avatars/rack`) para que solo se cargue lo que se usa.

| Para qué               | Tecnología                                                    |
| ---------------------- | ------------------------------------------------------------- |
| Lenguaje               | TypeScript                                                    |
| Monorepo               | pnpm workspaces: núcleo, React, CLI y galería en un solo repo |
| Empaquetado            | tsup: ESM + tipos, una entrada por colección                  |
| Tests                  | Vitest: unitarios y snapshots                                 |
| Lint y formato         | Biome                                                         |
| CI                     | GitHub Actions: lint, tests, build y tamaño                   |
| Versiones y changelog  | Changesets                                                    |
| Galería                | Vite + TypeScript sin framework, publicada en GitHub Pages    |
| Integraciones (fase 4) | React (componente), Node (CLI), Docker (API HTTP)             |

El paquete publicado no tiene dependencias en tiempo de ejecución: todo lo de la tabla es para desarrollar.

Esta garantía corresponde al **núcleo**. Los adaptadores tienen sus propios requisitos (por ejemplo, React como peer dependency). Ya se compilan ESM y tipos; no se ofrece CommonJS. La entrada raíz no importa colecciones. `package.json` y el lockfile fijan herramientas; el desarrollo requiere pnpm 11.25.0 y Node `^24.11.0 || >=26.0.0`. La estructura anterior sigue siendo el destino previsto: actualmente existen `packages/core` y `apps/gallery`; no se crean paquetes vacíos para fases futuras.

### 5.1 Git y distribución

- **En Git:** fuentes, configuración compartida, scripts públicos reproducibles, pruebas, snapshots con datos ficticios, recursos con licencia, documentación y lockfile.
- **Fuera de Git:** herramientas internas/privadas, estado local de asistentes, credenciales, `.env` reales, datos personales, dependencias, cachés, builds y exportaciones. El `.gitignore` inicial aplica estas exclusiones; no detecta secretos dentro de archivos permitidos ni retira archivos ya versionados.
- **En npm:** cada paquete usará `files` con lista positiva de salida compilada, README, licencia y avisos necesarios. Raíz y galería privadas. Revisar el inventario de `npm pack --dry-run --json` y probar el paquete instalado antes de publicar.
- **Licencia:** MIT para código, documentación y arte original; cualquier recurso de terceros conserva sus propios términos y avisos. No incorporar glifos de una fuente sin revisar y distribuir su licencia.

Procedimiento completo en [REPOSITORY_HYGIENE.md](docs/REPOSITORY_HYGIENE.md).

## 6. Galería

Una web estática que hace de banco de pruebas mientras diseñamos y de escaparate para quien llega al repo. Vive en `apps/gallery` y se publica en GitHub Pages.

### Controles

- **Colección:** cualquiera de las 13.
- **Paleta:** «Auto» (las de la colección) o un tema global. Más adelante, un editor para crear una paleta propia con los 5 roles.
- **Semilla:** texto libre.
- **Forma:** cuadrado, redondeado o círculo.
- **Fondo de la página:** claro u oscuro.
- **Opciones propias** de la colección, por ejemplo `status` en Rack o `animal` en Origami.

### Vistas

1. **Tamaños:** la misma semilla a 24, 32, 48, 64 y 128 px.
2. **Variedad:** una cuadrícula de 12 semillas; en modo revisión, una «hoja de contactos» de 60.
3. **En contexto:** el avatar dentro de interfaces reales:
   - Lista de miembros (32 px).
   - Comentario (40 px).
   - Pila de avatares solapados (28 px).
   - Tabla de servidores con estado (24 px). Con Rack, los LEDs siguen el estado.
   - Cabecera de perfil (72 px).
4. **Comparar paletas:** la misma semilla con todos los temas, lado a lado.
5. **Código:** el fragmento listo para copiar con las opciones elegidas (`createAvatar`, `<img src>`, React) y un botón para descargar el SVG.

El estado de la pantalla (colección, paleta, semilla y forma) se guarda en la URL para poder compartir una vista concreta.

Una URL compartida expone su semilla. La documentación, las capturas y las pruebas utilizarán nombres y hosts ficticios; el hash no es anonimización. La galería no necesitará backend para generar avatares.

## 7. Calidad

- **Tests unitarios:** hash y PRNG con vectores conocidos; iniciales con casos raros (acentos, emojis, texto vacío, emails, hostnames); contraste de `readable`.
- **Determinismo:** la misma entrada da el mismo SVG en ejecuciones distintas, y también en Node y en el navegador.
- **Snapshots:** 20 semillas fijas por colección.
- **Validez:** XML bien formado, sin `NaN` ni `undefined`, ids únicos y `viewBox` correcto.
- **Tamaño:** objetivo orientativo de ≤ 4 KB por avatar sin comprimir. El CI avisa si se supera.
- **Revisión visual:** la hoja de contactos de la galería, con 60 semillas por colección a 24, 32, 64 y 128 px, sobre fondo claro y oscuro y con todos los temas.

## 8. Cómo se diseña una colección (checklist)

1. **Ficha:** tema, a quién va dirigida, qué varía y qué paletas usa.
2. **Boceto** en la galería.
3. **Variantes y probabilidades,** con un sub-flujo por rasgo.
4. **Tamaños:** revisión a 24, 32, 64 y 128 px, en claro y en oscuro.
5. **Variedad:** con 60 semillas no debe haber «gemelos» evidentes.
6. **Contraste:** los elementos principales se distinguen del fondo con sus paletas y con todos los temas globales.
7. **Combinaciones desafortunadas:** comprobar que ninguna produzca formas o gestos ofensivos.
8. **Opciones propias** documentadas (cómo forzar cada variante).
9. **Cierre:** snapshots, README de la colección con ejemplos y entrada en la galería.

## 9. Hoja de ruta

Orden: **0 → 1 → 2 → 3 → 4 → 5**. No se fijan fechas antes de tener el motor y medir el trabajo visual. Cada fase se cierra con sus comprobaciones y documentación actualizadas, no solo con dibujos terminados. No se da por implementada ninguna fase por existir este documento.

### Fase 0 · Cimientos

**Objetivo:** demostrar el contrato técnico antes de producir las colecciones.

**Estado al 2026-10-23:** implementación y comprobación local terminadas. `pnpm check` pasa en Node 24.21/Windows: lint, tipos, 38 pruebas unitarias, snapshots de 20 semillas, build, revisión de rutas/credenciales e historial, límites de tamaño, empaquetado e instalación aislada con tipos, y dos pruebas en Chromium. Se ha comprobado paridad Node/navegador y descarga de SVG. La colección `fixtures/test-collection.ts` no se exporta ni entra en npm. El workflow contempla Linux/Node 24.11 y 26, y Windows/Node 24. **Verificación remota:** los commits ya están subidos; consultar el resultado del commit correspondiente en [GitHub Actions](https://github.com/paulaquiin/lazy-avatars/actions/workflows/ci.yml).
1. Documentación, licencia MIT, arquitectura y exclusiones de Git. Esta parte queda preparada el 2026-10-23; no cierra la fase.
2. Comprobar disponibilidad y propiedad de los nombres npm; fijar versiones compatibles de Node, pnpm y herramientas. Crear workspace privado, paquete core, galería mínima y lockfile.
3. Configurar TypeScript estricto, tsup, Vitest, Biome y scripts reproducibles de lint, tipos, tests y build. Incorporar Changesets.
4. Cerrar tipos de API: temas/paletas, inferencia de opciones, entradas inválidas, semilla vacía, `idPrefix` y fallback de contraste.
5. Implementar hash UTF-8, RNG con sub-flujos, SVG, iniciales, color y envoltorio común. Validar/escapar entradas y excluir recursos activos o remotos del SVG.
6. Implementar `createAvatar` y `createAvatarDataUri`, una colección de prueba no pública y galería mínima con semilla y tamaños.
7. Incorporar CI para lint, tipos, tests, build, tamaños, detección de secretos y revisión del contenido del paquete. Las restricciones de publicación deben existir antes del primer release.

**Cierre verificable:** vectores de hash/RNG, Unicode e iniciales pasan; la misma entrada produce exactamente los mismos bytes en Node y navegador; cambiar un sub-flujo no altera otro; SVG válido, escape de entradas y aislamiento mediante `idPrefix` probados. El núcleo compilado no tiene dependencias de ejecución. Todos los checks pasan en CI y el paquete de prueba instalado fuera del workspace resuelve sus entradas. El README contiene entonces comandos reales verificados.

### Fase 1 · v0.1: validar el motor con 4 colecciones

**Estado al 2026-10-23:** cuatro colecciones y galería implementadas; 57 pruebas unitarias, 20 snapshots por colección y siete pruebas en Chromium. v0.1.0 se instala y comprueba fuera del monorepo, con grafos que verifican el aislamiento. Pages se despliega tras CI verde. Actualización 2026-10-24: v0.1.0 publicada tras completar 2FA, con instalación desde el registro, cuatro subrutas y tipos públicos verificados; integridad idéntica al tarball revisado. Revisión y límites en [PHASE1_REVIEW.md](docs/PHASE1_REVIEW.md).

**Depende de:** fase 0. **Objetivo:** primera versión pequeña que valide todos los mecanismos del motor.
1. **Mosaico:** validar composición geométrica, orientaciones y paletas.
2. **Monograma:** validar iniciales como paths, fallback de glifos y avisos de la fuente si se usa una de terceros.
3. **Rack:** validar LCD, inferencia de opciones y los cuatro estados (`ok`, `warn`, `down`, `off`), acompañados de texto en los ejemplos.
4. **Siesta:** validar personaje, accesorios y variedad; posponer el logo definitivo hasta la revisión de identidad.
5. Completar la galería del §6: formas, temas, tamaños, contexto, contacto de 60 semillas, URL compartible, ejemplos y descarga. Mostrar solo colecciones implementadas.
6. Revisar el paquete real y publicar v0.1 y la galería en GitHub Pages con un flujo de release controlado.

**Cierre verificable:** las cuatro pasan el checklist del §8, los 20 snapshots fijos por colección, XML, referencias/IDs y determinismo. Se revisan 60 semillas a los cuatro tamaños con temas y fondos claros/oscuros; el objetivo es legibilidad a 32 px. CI avisa sobre SVG de más de 4 KB sin comprimir. Las subrutas se importan desde un paquete instalado sin arrastrar colecciones ajenas. Licencias, README, changelog y contenido de distribución revisados; publicación y galería comprobadas.

### Fase 2 · v0.2: resto de clásicas y originales

**Estado al 2026-10-24:** cinco colecciones implementadas, 88 pruebas unitarias y 17 de Chromium; 20 snapshots por colección, nueve subrutas instaladas desde tarball y 30 hojas de revisión con 60 semillas, cuatro tamaños, seis temas y dos fondos. v0.2.0 publicada desde `5f71c88`, con CI y Pages en verde; instalación desde npm en directorio vacío, integridad y tipos públicos verificados. Evidencia y límites en [PHASE2_REVIEW.md](docs/PHASE2_REVIEW.md).

**Depende de:** fase 1. **Objetivo:** ampliar el catálogo sin cambiar el contrato común.
1. Implementar Origami, Despensa, Déco, Latte y Constelación, una a una.
2. Añadir sus controles específicos (`animal`, `food`, `motif`, `art`), paletas, documentación y entradas en galería.
3. Revisar detalles pequeños, grosor mínimo de trazo y contraste de constelaciones. Conservar los snapshots de las colecciones existentes o versionar cualquier cambio de salida.

**Cierre verificable:** nueve colecciones disponibles; cada nueva colección pasa el §8 y los checks de fase 1; opciones forzadas probadas; sin cambios de salida no declarados en las cuatro anteriores. v0.2 y galería publicadas con sus avisos de licencia.

### Fase 3 · v0.3: robots y familia espacial

**Estado al 2026-10-24:** Hojalata, Órbita, Misión y Casco implementadas con opciones tipadas, cinco paletas propias por colección y veinte snapshots por colección. 117 pruebas unitarias y 26 de Chromium aprobadas localmente. Revisión visual de 11 520 avatares y comparador espacial; glifos sans originales MIT. v0.3.0 publicada desde `2e95df8`, con CI y Pages aprobados; instalación aislada desde npm, trece subrutas, tipos e integridad verificados. Evidencia y límites en [PHASE3_REVIEW.md](docs/PHASE3_REVIEW.md).

**Depende de:** fase 2. **Objetivo:** completar las 13 colecciones y diferenciar los estilos espaciales.
1. Implementar Hojalata, Órbita, Misión y Casco.
2. Revisar reflejos, anillos, siluetas y glifos de Misión; documentar cada variante principal y cómo forzarla.
3. Comparar Constelación, Órbita, Misión y Casco juntas para evitar que sean intercambiables visualmente. Completar la navegación de la familia espacial en la galería.

**Cierre verificable:** 13 colecciones con documentación, opciones, snapshots y checklist visual completos; licencias de glifos resueltas; regresiones y contenido de paquetes comprobados. v0.3 y galería actualizadas.

### Fase 4 · Integraciones

**Estado al 2026-10-24:** cuatro adaptadores 0.1.0 preparados con ejemplos ejecutables, SSR/hidratación, errores de transporte y revisión de distribución. Editor de cinco colores con contraste y URL restaurable. 123 pruebas unitarias y 29 de navegador; comprobación completa local aprobada y Docker verificado en CI Linux. No se publica ningún adaptador ni servicio público. Véase [INTEGRATIONS.md](docs/INTEGRATIONS.md).

**Depende de:** fase 3 y API del núcleo revisada. **Objetivo:** adaptar el mismo motor sin duplicarlo.
1. Paquete React con tipos, accesibilidad, IDs por instancia y comportamiento SSR/hidratación probado.
2. Web component `<lazy-avatar collection="rack" seed="demo-server-01">`, con atributos documentados y registro explícito de las colecciones usadas.
3. CLI para exportar SVG y reportar errores por stderr/código de salida. Comando objetivo: `npx @paulaquiin/lazy-avatars-cli rack demo-server-01 > avatar.svg` (nombre sujeto a disponibilidad).
4. API HTTP autoalojable (`/rack/demo-server-01.svg`) con Dockerfile, validación de rutas/opciones, límites de entrada, cabeceras y caché definidos. No desplegar un servicio público del proyecto.
5. Editor de los cinco roles de paleta en la galería con validación y previsualización de contraste.

**Cierre verificable:** ejemplos ejecutables de cada integración, equivalencia visual con el núcleo, dependencias contenidas en sus adaptadores y tests de errores. React funciona con varias instancias y SSR sin colisiones; CLI genera SVG válido; imagen Docker arranca y responde con tipo MIME correcto. Cada paquete pasa revisión de distribución y licencia.

### Fase 5 · v1.0

**Estado al 2026-10-24:** preparada 1.0.0 sin cambios de renderizado ni nuevos tests. Contrato y migración en [STABILITY.md](docs/STABILITY.md), matriz y medidas en [COMPATIBILITY.md](docs/COMPATIBILITY.md), identidad original MIT en `assets/brand`, contribuciones bilingües y anuncio solo como borrador. Adaptadores bajo @paulaquiin aprobado por la mantenedora; CI y publicación pendientes.

**Depende de:** fase 4 y revisión de todos los contratos. **Objetivo:** comprometer estabilidad pública sobre una versión comprobada.
1. Congelar API, IDs públicos de colecciones/temas y contrato `outputVersion`; documentar migraciones y política de cambios incompatibles.
2. Revisar compatibilidad real, rendimiento, tamaño del núcleo y colecciones, datos de accesibilidad, ejemplos y límites conocidos. Publicar la matriz de entornos verificados.
3. Completar documentación en inglés y español, guía de contribuciones, licencias y avisos de terceros. Crear identidad visual y logo a partir de Siesta con derechos revisados.
4. Auditar Git e inventarios npm, ejecutar CI completo y prueba de instalación/exportación desde paquetes preparados para distribución.
5. Publicar v1.0, actualizar la galería y preparar el texto de anuncio. Su envío o difusión se hará cuando se solicite.

**Cierre verificable:** todos los checks en verde, 13 colecciones revisadas, contratos y limitaciones documentados, releases instalables y reproducibles desde el código y lockfile correspondientes, sin secretos ni herramientas privadas distribuidos. La estabilidad se garantiza para la versión fijada y las mismas entradas/opciones; no se ofrece un selector histórico de `outputVersion`.

## 10. Decisiones de base y pendientes

Las propuestas siguientes se usan como base de la documentación del 2026-10-23. El workspace existe; las verificaciones que sigan pendientes se indican en cada fila y no implican que haya paquetes publicados.

| #   | Decisión                                   | Opciones                                     | Propuesta                                                                                                                                       |
| --- | ------------------------------------------ | -------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Idioma del código, la API y el README      | Inglés / español / bilingüe                  | Base: código/API y README principal en inglés; `README.es.md` añadido                                                                           |
| 2   | Nombre en npm                              | `lazy-avatars` / scope `@lazy-avatars/*`     | Núcleo lazy-avatars y cuatro adaptadores @paulaquiin/lazy-avatars-*; scope elegido por la mantenedora para 1.0                                  |
| 3   | Licencia                                   | MIT / Apache-2.0                             | MIT añadida para código, documentación y arte original; terceros conservan sus términos                                                         |
| 4   | Glifos de Monograma y Misión               | Diseño propio / fuente OFL                   | Monograma usa paths serif y Misión paths sans originales MIT; sin fuentes de terceros                                                           |
| 5   | Mayúsculas en la semilla                   | Respetar / ignorar                           | Respetar (`Ana` ≠ `ana`) y documentar que los emails se pasen en minúsculas                                                                     |
| 6   | Tamaño mínimo garantizado                  | 24 px / 32 px                                | 32 px                                                                                                                                           |
| 7   | API HTTP                                   | Servicio público propio / solo autoalojable  | Solo autoalojable, para evitar costes y abusos                                                                                                  |
| 8   | ids de las colecciones                     | Inglés / español                             | Inglés (los de la tabla del §2)                                                                                                                 |
| 9   | Temas globales iniciales                   | Los 5 propuestos / otros                     | Pastel, Corporativo, Noche, Tierra y Monocromo, ampliables                                                                                      |
| 10  | Tecnología de la galería                   | Vite sin framework / Astro / React           | Vite sin framework; pasar a Astro si crece hasta ser la web de documentación                                                                    |
| 11  | Compatibilidad y versiones de herramientas | Baselines fijados y versiones en el lockfile | Node 24.11+ (24.x) o 26+, pnpm 11.25.0; ESM + tipos; verificación local Node 24.21 y Chromium; resultados de la matriz remota en GitHub Actions |
| 12  | IDs repetidos en SVG inline                | Aleatoriedad / contador / prefijo explícito  | `idPrefix` explícito por instancia; núcleo determinista sin estado global                                                                       |

## 11. Registro de decisiones

- **2026-10-22:** se aprueban 13 colecciones: las 10 de la primera propuesta menos Señales, más Hojalata, Órbita, Misión y Casco.
- **2026-10-22:** se descarta Señales.
- **2026-10-22:** fase de planificación; no se escribe código hasta cerrar el plan.
- **2026-10-22:** se añaden la galería (paletas, formas, tamaños y ejemplos de uso) y el modelo de color por roles con temas globales.
- **2026-10-23:** se documenta la arquitectura de monorepo TypeScript y se amplían las fases con dependencias, entregables y criterios de cierre. No se inicia implementación.
- **2026-10-23:** se añaden README principal y español, licencia MIT y reglas de Git/distribución. Se distinguen los permisos del arte original y las futuras licencias de terceros.
- **2026-10-23:** se concreta el contrato determinista con opciones, UTF-8, sub-flujos y `idPrefix` para instancias inline. Los IDs de temas se fijan en inglés.
- **2026-10-23:** a petición de la usuaria, se implementa la fase 0: motor sin dependencias de ejecución, temas, glifos propios, galería mínima, herramientas y CI. Comprobaciones locales completas en verde; primera ejecución remota pendiente de push. No se publica ningún paquete ni se implementan colecciones de fase 1.
- **2026-10-23:** se suben los commits a GitHub. El primer CI descubre que los tipos de la galería necesitan el build previo del núcleo; se corrige `pnpm typecheck` y se valida desde una copia limpia sin `dist`. Los resultados de cada commit se consultan en GitHub Actions.

- **2026-10-23:** se implementan las cuatro colecciones de fase 1, la galería ampliada y el despliegue condicionado a CI. Changesets prepara v0.1.0; npm continúa pendiente de sesión autenticada. Todos los glifos e ilustraciones añadidos son originales MIT.

- **2026-10-24:** sesión npm verificada y CI completo del commit `b5fc39c` en verde. Publicación intentada y detenida por npm con E403: requiere completar 2FA. Sin publicación ni tag de versión todavía.

- **2026-10-24:** completada la autorización 2FA y publicada v0.1.0 desde `5642202`, con CI y Pages en verde. Instalación desde npm en directorio vacío y caché nueva: motor, cuatro colecciones, SVG, URI de datos, determinismo y tipos públicos correctos. Integridad del tarball verificada; tag `v0.1.0` sobre el commit publicado.

- **2026-10-24:** implementada fase 2: Origami, Despensa, Déco, Latte y Constelación; opciones forzadas, nueve subrutas, galería y controles ampliados. 80 snapshots anteriores intactos, arte original MIT y núcleo sin cambios. Se corrige Biome para conservar el frontmatter de Changesets y se prepara v0.2.0.

- **2026-10-24:** publicada v0.2.0 tras autorización 2FA desde `5f71c88`, con CI completo y Pages aprobados. Tarball de 28 archivos verificado por integridad e instalación desde npm con caché nueva; nueve subrutas, SVG, URI, determinismo y tipos correctos. Tag `v0.2.0` sobre el commit publicado.

- **2026-10-24:** implementada fase 3 con cuatro colecciones, glifos sans originales de Misión y comparador espacial. 180 snapshots anteriores intactos; 117 pruebas unitarias y 26 de navegador aprobadas. Preparada v0.3.0.

- **2026-10-24:** publicada y verificada v0.3.0 tras autorización 2FA desde `2e95df8`, con CI y Pages aprobados. Instalación desde npm con caché nueva: trece colecciones, SVG, URI, determinismo y tipos correctos. Tarball de 36 archivos con integridad idéntica al revisado; tag `v0.3.0` sobre el commit publicado. Fase 3 cerrada.

- **2026-10-24:** fase 4 implementada sin cambiar el núcleo 0.3.0 ni sus colecciones. Cuatro adaptadores preparados como tarballs; scope pendiente de acreditar. React 19 como peer, web component con registro explícito, CLI, HTTP con caché y límites, Docker con contexto positivo y editor de paletas. CI Docker requerido antes de Pages.

- **2026-10-24:** verificados los tarballs de fase 4, 123 pruebas unitarias y 29 de navegador; revisión visual del editor en escritorio y móvil. Docker construido y arrancado en CI Linux: healthcheck, SVG/MIME, validación, uid 1000 y sistema de archivos de solo lectura aprobados ([ejecución](https://github.com/paulaquiin/lazy-avatars/actions/runs/40130418438/job/120981016230)). El núcleo publicado 0.3.0 conserva sus 260 snapshots.

- **2026-10-24:** la mantenedora elige publicar los adaptadores bajo @paulaquiin al no existir @lazy-avatars. Preparada versión 1.0.0 para núcleo y cuatro adaptadores, sin modificar motor, colecciones ni snapshots. Contrato estable, migración de nombres, identidad Siesta MIT, avisos, compatibilidad y medidas manuales. Se reutilizan las pruebas existentes.

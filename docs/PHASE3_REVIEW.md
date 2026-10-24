# Revisión de fase 3 · robots y familia espacial

Fecha: 2026-10-24. Hojalata, Órbita, Misión y Casco completan trece colecciones.
v0.3.0 publicada y verificada desde npm con trece subrutas, tipos e integridad; CI y Pages aprobados para el commit publicado.

## Implementación y licencias

Cada colección se importa por su subruta, tiene opciones tipadas, cinco paletas
originales y `outputVersion: 1`. Todas sus variantes principales se pueden forzar;
los valores omitidos se eligen uniformemente con RNG derivado de la semilla.
Los detalles usan streams con nombre independientes. Contratos y ejemplos:
- [Hojalata](../packages/core/src/collections/tinbot/README.md): antenas,
  ojos de instrumento/visor/mixtos y bocas de rejilla/sonrisa/puntos.
- [Órbita](../packages/core/src/collections/orbit/README.md): bandas/cráteres,
  anillos ausentes/finos/anchos, luna opcional, tamaño e inclinación variables.
- [Misión](../packages/core/src/collections/mission/README.md): tres insignias,
  tres planetas, cohete recto/inclinado e iniciales en una cinta.
- [Casco](../packages/core/src/collections/helmet/README.md): tres visores,
  tres reflejos planetarios y antenas opcionales.

Los 36 glifos A–Z/0–9 y el fallback `?` de Misión son trazos sans originales MIT.
No se incluyen fuentes de terceros, contornos extraídos de fuentes ni insignias
de agencias. Paletas, ilustraciones y documentación también son originales MIT.

## Revisión visual

Se renderizaron, decodificaron y revisaron 24 hojas: cuatro colecciones por seis
configuraciones de paleta (propia, pastel, corporate, night, earth, mono), con
60 identidades ficticias a 24/32/64/128 px sobre páginas claras y oscuras.
Total: 11 520 imágenes. Las capturas y utilidades de esta revisión son internas
y quedan fuera de Git y npm.

También se revisaron las 33 variantes principales a 32/128 px, todos los glifos
y fallbacks de Misión, y la familia espacial con la misma semilla en seis paletas.
Constelación presenta trazos y estrellas; Órbita, un planeta con volumen; Misión,
una insignia; Casco, un personaje astronauta. La galería permite compararlas a
32/64/128 px y abrir los controles de cada colección, también en móvil.

Se corrigió el contraste de la ventana del cohete sobre su cuerpo en Misión
con la paleta corporate, antes de publicar su primera versión de salida.
Una prueba comprueba ese contraste en todas las paletas propias y globales.
Los anillos de Órbita se dibujan detrás y delante del planeta. Casco recorta los
reflejos al visor; Misión recorta el campo a la insignia. Los clips se aíslan con
IDs por instancia para permitir SVG en línea repetidos.

El objetivo es reconocer la silueta a 32 px. A 24 px se simplifican remaches,
cráteres y detalles del cohete; las iniciales son un apoyo de la insignia.
No se observaron combinaciones ofensivas en la muestra. Esto no garantiza
unicidad visual ni cubre todas las semillas. Sobre fondo transparente, el
contraste depende de la superficie de la aplicación.

## Comprobaciones reproducibles

`pnpm check` aprueba localmente en Windows/Node 24.21:
- Lint, tipos, build, higiene de rutas/credenciales e historial disponible.
- 117 pruebas unitarias y 26 de Chromium: opciones forzadas, rechazo de opciones
  inválidas, XML, referencias, tamaños, transparencia, determinismo y paridad
  exacta Node/navegador. Galería con URL restaurable y vista espacial sin mezclar
  las opciones de una colección con otra.
- 20 snapshots por colección (260) más la figura del motor. Los 180 de las nueve
  colecciones anteriores se compararon byte a byte con v0.2.0 y no cambian.
- Instalación aislada del tarball con las trece subrutas ESM y tipos públicos.
  Inventario positivo de 36 archivos, sin dependencias de ejecución, credenciales
  ni herramientas internas. Grafo raíz: 16 380 bytes ESM / 5 408 bytes gzip.

Máximos SVG observados con 60 semillas, seis configuraciones de paleta, opciones
automáticas y sin título: Hojalata 1627, Órbita 1718, Misión 2028 y Casco 1732 bytes
UTF-8. Son medidas de la muestra, no límites de todos los títulos posibles.
Los tests aplican el presupuesto de 4 KiB a su matriz de avatares.

La publicación, el commit de origen y el CI remoto se registran en
[RELEASING.md](RELEASING.md). Fijar la versión del paquete o guardar el SVG para
conservar una salida histórica; `outputVersion` no selecciona versiones antiguas.

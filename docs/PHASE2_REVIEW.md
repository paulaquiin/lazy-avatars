# Revisión de fase 2 · 2026-10-24

Estado: cinco colecciones nuevas implementadas y revisadas; v0.2.0 preparada.
Publicación npm y tag pendientes de CI y comprobación del registro. Todas usan
arte y paletas originales bajo MIT, sin imágenes, fuentes o recursos de terceros.

## Catálogo y variación

| Colección    | Variantes forzables                 | Otros rasgos deterministas                           | Paletas |
| ------------ | ----------------------------------- | ---------------------------------------------------- | ------- |
| Origami      | `animal`: fox, cat, bear, owl       | mandíbula, cejas, pliegue                            | 5       |
| Despensa     | `food`: donut, citrus, egg, avocado | giro, virutas, 6–9 gajos, yema y hueso               | 5       |
| Déco         | `motif`: fan, arches, sun           | anchura, altura, costillas, niveles y rayos          | 5       |
| Latte        | `art`: heart, tulip, rosetta, rings | asa, extensión, pétalos y hojas                      | 5       |
| Constelación | sin opciones propias                | 4–6 estrellas, posiciones, tamaño, rotación y cierre | 5       |

Cada rasgo tiene su subflujo con nombre. Las variantes principales se validan y
prueban forzadas, no dependen de encontrarlas por casualidad entre las semillas.
Todas comienzan con `outputVersion: 1`.

## Revisión visual

Se generaron, decodificaron en Chromium e inspeccionaron 30 hojas: cinco
colecciones por seis configuraciones de paleta (propias y cinco temas). Cada
hoja contiene las 60 identidades ficticias a 24, 32, 64 y 128 px, sobre página
clara y oscura: 14 400 imágenes en la matriz final. Se revisaron además todas
las variantes principales forzadas a 128 y 32 px. Las hojas de Origami y Despensa
se regeneraron tras ajustar ojos del búho y gajos del cítrico.
- Origami conserva las siluetas angulares y la separación de sus ojos; los
  pliegues finos son decorativos.
- Despensa limita las virutas a cinco y evita depender de ellas para reconocer
  el alimento. Los temas globales producen alimentos de colores estilizados.
- Déco usa trazos estructurales de 2.5 unidades del viewBox: 1 px a 32 px. El
  marco y los tres motivos se mantienen legibles; el abanico se densifica a 24 px.
- Latte distingue corazón, tulipán, roseta y anillos; los detalles de hojas y
  pétalos se simplifican visualmente a 24 px. La espuma se selecciona con 3:1
  de contraste contra el café. Los temas también recolorean el café.
- Constelación mantiene las estrellas principales separadas y dentro del recorte
  circular. Sus trazos y estrellas principales alcanzan 3:1 contra el fondo de
  cada paleta; las motas decorativas tienen menor opacidad y pueden desaparecer
  a 24 px. Los temas claros usan cielo claro y trazos oscuros.

No se observaron combinaciones ofensivas en las muestras revisadas. Las pruebas
descartan SVG exactamente iguales tras retirar IDs en las 60 semillas con paletas
propias; no garantizan identidades visuales únicas. En especial, dos Déco del
mismo motivo o dos Latte de anillos pueden parecerse en pequeño. El objetivo
de diseño es 32 px. Con fondo transparente, el consumidor debe comprobar el
contraste contra su superficie real.

Las capturas y el generador de revisión son artefactos locales en `.tools/`,
ignorados por Git y ausentes del inventario npm.

## Evidencia automatizada

- 88 pruebas unitarias: 20 snapshots por cada una de las nueve colecciones,
  XML, IDs y referencias, tamaño, opciones forzadas, errores de enums, variantes
  transparentes a los cuatro tamaños, contraste y separación geométrica.
- Los 80 SVG de los snapshots de Mosaico, Monograma, Rack y Siesta siguen
  idénticos byte a byte; no se ha modificado el motor ni su API.
- 17 pruebas de Chromium: las nueve colecciones comparadas con Node sobre
  Unicode, cinco temas y tres formas; carga de imágenes, opciones, URL/reload,
  contactos, descarga, portapapeles, móvil y ausencia de recursos remotos.
- Instalación aislada del tarball y declaraciones públicas; nueve subrutas
  independientes, grafo raíz sin colecciones ajenas y sin chunks huérfanos.
- Inventario npm positivo de 28 archivos: código/tipos compilados, manifiesto,
  README, licencia y changelog. Sin dependencias de ejecución ni credenciales.

El motor conserva 16 380 bytes ESM / 5 408 bytes gzip, dentro de los presupuestos
de 24 / 8 KiB. Máximo SVG medido entre las 60 semillas y seis configuraciones
de paleta con opciones por defecto (bytes UTF-8, sin título):

| Origami | Despensa | Déco | Latte | Constelación |
| ------- | -------- | ---- | ----- | ------------ |
| 857     | 1403     | 914  | 1201  | 1281         |

Estos máximos describen esa muestra, no todas las entradas posibles. Los tests
vigilan el presupuesto de 4 KiB y el empaquetado; los límites de entrada y el
escapado del motor siguen aplicándose.

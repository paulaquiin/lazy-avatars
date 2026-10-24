# Revisión de fase 1 · 2026-10-23

Implementadas: Mosaico, Monograma, Rack y Siesta. Cada una tiene contrato de
colección, paletas propias, variantes forzables, documentación y `outputVersion: 1`.
Las 60 identidades del contacto se inventan en `fixtures/contact-seeds.ts`.

## Comprobaciones reproducibles

- 20 snapshots fijos por colección, además de los 20 del motor de fase 0.
- SVG XML válido, IDs y referencias consistentes, sin `text`, scripts, fuentes o
  recursos externos, para 60 semillas y las paletas propias/cinco temas globales.
- Los SVG revisados no superan 4096 bytes, incluso con un título accesible.
- No hay dibujos exactamente duplicados en las hojas de 60 semillas tras retirar
  los identificadores de instancia del SVG. Esto no garantiza unicidad universal.
- Los estados de Rack conservan su color con todos los temas y su default es
  apagado. Los ejemplos en contexto incluyen siempre etiquetas textuales.
- Paridad byte a byte en Node y Chromium con cuatro semillas (acentos, Unicode y
  caracteres XML), los cinco temas y las tres formas, para las cuatro colecciones.
- Descarga del SVG real, restauración de URL/opciones, 60 contactos a los cuatro
  tamaños, ejemplos copiables, contraste de página y disposición móvil probados.
- Paquete instalado en una carpeta temporal, con ESM y tipos por subruta. Análisis
  de grafos para impedir que motor o colección importen otras colecciones, y para
  rechazar chunks huérfanos, archivos inesperados y patrones de credenciales.

## Revisión visual

La galería ofrece la hoja de contacto a 24, 32, 64 y 128 px, con todos los temas y
fondos claros/oscuros, además de controles para forzar cada variante. La revisión
de 32 px cubre las 60 semillas por colección y los seis conjuntos de paletas en
ambos fondos. Mosaico mantiene sus arcos/teselas; Monograma conserva sello e
iniciales; Rack se identifica como tres unidades con LCD y Siesta como criatura
dormida con accesorio. No se observan combinaciones ofensivas en estas hojas.

Se revisan además muestras nativas a 24, 64 y 128 px con paletas propias, Noche y
Monocromo, y el alfabeto serif completo a 128 px, incluidos números, pares anchos
y glifos de sustitución. Las muestras grandes permiten revisar paths y contornos;
las pequeñas muestran la pérdida de detalle esperable en el LCD y las serifas.

El objetivo garantizado de diseño es 32 px. A 24 px se pierden detalles serif y
del LCD; el color de los LEDs no sustituye una etiqueta de estado. Monograma no
incorpora una fuente externa: los paths serif son originales. Las capturas de
revisión son temporales y permanecen en `.tools/`, excluida de Git y npm.

## Publicación

v0.1.0 está preparada mediante Changesets. La galería se publica tras CI verde.
La primera publicación npm queda pendiente de completar 2FA (E403), con sesión ya iniciada: el procedimiento
está en [RELEASING.md](RELEASING.md). No se marca esa parte como completada sin
comprobar la versión real en el registro.

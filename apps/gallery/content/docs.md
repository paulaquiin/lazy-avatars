# Documentación de la API de lazy-avatars

lazy-avatars es una librería de avatares SVG deterministas para JavaScript y TypeScript. Incluye 13 colecciones originales. La generación se ejecuta en tu aplicación; React, la CLI y el servidor HTTP autoalojable son opciones del mismo paquete.

## Empieza con JavaScript o TypeScript

Instala el paquete y elige una colección. La misma semilla, colección, versión y configuración producen el mismo SVG. Si necesitas conservar exactamente un avatar tras actualizar el paquete, guarda el SVG generado.

```sh
npm install lazy-avatars
```

```ts
import { createAvatar } from 'lazy-avatars';
import { origami } from 'lazy-avatars/origami';

const svg = createAvatar(origami, {
  seed: 'Ada Moss',
  size: 128,
  shape: 'rounded',
  title: 'Avatar de Ada Moss',
  options: { animal: 'fox' },
});
```

`createAvatar` devuelve una cadena SVG. Si necesitas una URL para el atributo `src` de una imagen, usa `createAvatarDataUri` con los mismos argumentos.

## Referencia de createAvatar

La firma es `createAvatar(collection, options): string`. `collection` es una de las 13 colecciones importadas por su subruta. `options` contiene `seed`, una cadena obligatoria que identifica el avatar.
- `size`: número entero de 1 a 4096. Por defecto, 64.
- `shape`: `square`, `rounded` o `circle`. Por defecto, `rounded`.
- `title`: nombre accesible del SVG. Sin título, el SVG es decorativo.
- `background`: booleano. Por defecto, `true`.
- `palette`: uno de los temas `pastel`, `corporate`, `night`, `earth` o `mono`; también admite una paleta propia o una lista de paletas. Sin este ajuste, se usan las paletas de la colección.
- `options`: ajustes propios de cada colección. Consulta sus páginas para ver ejemplos.
- `idPrefix`: prefijo para los identificadores internos del SVG cuando insertas varias instancias en un documento.

Puedes usar los SVG en perfiles, equipos o bots. La colección Rack también muestra un estado que proporciona tu aplicación; acompáñalo de una etiqueta de texto. La librería no comprueba el estado del servidor.

## React opcional

Instala React 19 solo si utilizas la entrada `lazy-avatars/react`.

```sh
npm install lazy-avatars react@19
```

```tsx
import { Avatar } from 'lazy-avatars/react';
import { origami } from 'lazy-avatars/origami';

<Avatar collection={origami} seed="Ada Moss" size={128} title="Avatar de Ada Moss" />;
```

## CLI: genera un archivo SVG

La CLI viene en el paquete. La salida correcta contiene el SVG, así que puedes redirigirla a un archivo. Recibe primero la colección y después la semilla.

```sh
npx lazy-avatars origami "Ada Moss" --size 128 > avatar.svg
```

Admite `--shape`, `--theme`, `--palette`, `--background`, `--title`, `--idPrefix` y `--options`. Usa `--help` para ver la sintaxis. Los errores devuelven código de salida 1.

## HTTP autoalojable

El paquete incluye un servidor Node que puedes ejecutar en tu infraestructura. Este sitio no ofrece una API pública de imágenes ni necesita una clave para generar avatares en la galería.

```sh
npx --package=lazy-avatars lazy-avatars-http
```

Por defecto escucha en `127.0.0.1:3000`. Una petición como `GET /origami/Ada%20Moss.svg?size=128` devuelve un SVG. `GET /healthz` comprueba que el servidor responde. Configura TLS, límites de peticiones y acceso en tu despliegue si lo expones a Internet; las URL pueden contener la semilla.

## Más integraciones y código fuente

El paquete también incluye [un web component](https://github.com/paulaquiin/lazy-avatars/blob/main/docs/integrations/web-component.md). Consulta los detalles de [React](https://github.com/paulaquiin/lazy-avatars/blob/main/docs/integrations/react.md), [CLI](https://github.com/paulaquiin/lazy-avatars/blob/main/docs/integrations/cli.md), [HTTP](https://github.com/paulaquiin/lazy-avatars/blob/main/docs/integrations/http.md) y el [contrato completo del paquete](https://github.com/paulaquiin/lazy-avatars/blob/main/packages/core/README.md) en GitHub.

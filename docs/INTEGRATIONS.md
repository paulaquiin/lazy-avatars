# One package / Un único paquete

1.1.0 is prepared, not yet published. Published 1.0.0 packages remain available.
La versión 1.1.0 está preparada y pendiente de publicar; 1.0.0 sigue disponible.

```sh
npm install lazy-avatars@1.1.0
# Only for React / Solo si usas React:
npm install react@19
```

| Entry / Entrada              | Export                                           | Contract / Contrato                             |
| ---------------------------- | ------------------------------------------------ | ----------------------------------------------- |
| `lazy-avatars`               | createAvatar, createAvatarDataUri, helpers/types | Core, no runtime dependencies                   |
| `lazy-avatars/react`         | Avatar, AvatarProps                              | [React](integrations/react.md)                  |
| `lazy-avatars/web-component` | registerLazyAvatar                               | [Custom element](integrations/web-component.md) |
| `lazy-avatars/cli`           | run, usage                                       | [CLI](integrations/cli.md)                      |
| `lazy-avatars/http`          | createAvatarServer                               | [HTTP/Docker](integrations/http.md)             |

Collection subpaths remain unchanged. React is an optional peer: npm does not
install it for core users. Browser/core imports never reach Node server modules
or React. All code ships in one tarball, but imports and bundlers keep runtime
module graphs separate. HTTP uses standard Node modules and starts only on listen.
The web component still requires explicit collection registration.

Las trece colecciones y los bytes SVG no cambian. Un solo tarball contiene todas
las integraciones; solo se carga el grafo de la entrada utilizada. React es opcional,
no una dependencia que se imponga al núcleo. CLI y HTTP quedan en entradas Node.
El web component conserva el registro explícito y el aislamiento de shadow DOM.

## Migration / Migración

Replace imports `@paulaquiin/lazy-avatars-react` with `lazy-avatars/react`, and do
the same for web-component, cli and http. Component/function APIs are unchanged.
Remove the old adapter dependency after updating your imports. Those previously
published packages are not deleted, republished or deprecated by this source change.

Cambia los imports de los cuatro paquetes `@paulaquiin/lazy-avatars-*` por las
subrutas equivalentes y elimina esas dependencias. Las APIs se mantienen. Los
paquetes ya publicados siguen disponibles; no se modifican en el registro.

## Checkout examples / Ejemplos desde el repositorio

```sh
pnpm install --frozen-lockfile
pnpm build
pnpm --filter @lazy-avatars/integration-examples preview
node packages/core/dist/cli-bin.js rack demo-server-01
node packages/core/dist/http-bin.js
```

After registry publication: `npx lazy-avatars rack demo-server-01 > avatar.svg`;
for HTTP, `npx --package=lazy-avatars lazy-avatars-http`.
Docker: `docker build -f packages/core/Dockerfile -t lazy-avatars-http .`.

The existing package checks install the same tarball in isolation without React
and with React, verify typed subpaths and executable bins, inspect the positive
file inventory and enforce root/collection import isolation. No new test suite.
El CI existente comprueba instalación, tipos, SSR/hidratación, web component,
CLI/HTTP, SVG sin regresiones, Docker y galería. No se añade otra suite.

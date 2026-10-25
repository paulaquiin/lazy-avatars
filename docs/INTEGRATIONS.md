# One package / Un único paquete

1.1.0 is published and verified from npm, with and without React. Old scoped packages remain available.
La versión 1.1.0 está publicada y verificada desde npm, con React y sin React. Los paquetes con scope anteriores siguen disponibles.

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
published packages are deprecated on npm as of 2026-10-25, with migration notices
on every published version. They remain available for existing installations.

Cambia los imports de los cuatro paquetes `@paulaquiin/lazy-avatars-*` por las
subrutas equivalentes y elimina esas dependencias. Las APIs se mantienen. Los
paquetes antiguos están marcados como obsoletos en npm desde el 2026-10-25,
con avisos de migración en todas sus versiones. Siguen disponibles para instalaciones existentes.

| Old package / Paquete antiguo            | Replacement import / Import nuevo |
| ---------------------------------------- | --------------------------------- |
| `@paulaquiin/lazy-avatars-react`         | `lazy-avatars/react`              |
| `@paulaquiin/lazy-avatars-web-component` | `lazy-avatars/web-component`      |
| `@paulaquiin/lazy-avatars-cli`           | `lazy-avatars/cli`                |
| `@paulaquiin/lazy-avatars-http`          | `lazy-avatars/http`               |

Install / Instala `lazy-avatars@^1.1.0`. CLI: `npx lazy-avatars`;
HTTP: `npx --package=lazy-avatars lazy-avatars-http`.

## Checkout examples / Ejemplos desde el repositorio

```sh
pnpm install --frozen-lockfile
pnpm build
pnpm --filter @lazy-avatars/integration-examples preview
node packages/core/dist/cli-bin.js rack demo-server-01
node packages/core/dist/http-bin.js
```

From npm: `npx lazy-avatars rack demo-server-01 > avatar.svg`;
for HTTP, `npx --package=lazy-avatars lazy-avatars-http`.
Docker: `docker build -f packages/core/Dockerfile -t lazy-avatars-http .`.

The existing package checks install the same tarball in isolation without React
and with React, verify typed subpaths and executable bins, inspect the positive
file inventory and enforce root/collection import isolation. No new test suite.
El CI existente comprueba instalación, tipos, SSR/hidratación, web component,
CLI/HTTP, SVG sin regresiones, Docker y galería. No se añade otra suite.

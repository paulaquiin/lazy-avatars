# CLI · lazy-avatars/cli

Available in lazy-avatars 1.1.0, published on npm.

```sh
npx lazy-avatars@1.1.0 rack demo-server-01 --theme night > avatar.svg
# From checkout, after build:
node packages/core/dist/cli-bin.js rack demo-server-01
```

Library entry exports run(args, {stdout, stderr}) and usage. Positional arguments
are collection ID and seed, followed by flag/value pairs: --size, --shape, --theme,
--palette (JSON), --background true|false, --title, --idPrefix, --options (JSON).
Use theme or palette, not both. Duplicate/unknown flags, invalid JSON and core
inputs fail. Success emits only SVG without trailing newline and returns 0.
--help prints usage and returns 0. Invalid input emits a generic stderr diagnostic
and returns 1, without logging seeds. All thirteen collections are included only
in this Node entry graph. Shell quoting and redirection encoding rules apply.

Un solo paquete; el bin lazy-avatars exporta SVG y la entrada /cli permite usar run
sin iniciar procesos. Errores por stderr/código 1, sin datos reales en mensajes.

# @paulaquiin/lazy-avatars-cli

SVG export CLI, version 1.0.0. MIT. The executable is `lazy-avatars`; its only
runtime dependency is lazy-avatars ^1.0.0. ESM and public types are also exported.

```sh
npx @paulaquiin/lazy-avatars-cli@1.0.0 rack demo-server-01 > avatar.svg
```

Run from this checkout after `pnpm install --frozen-lockfile` and `pnpm build`:

```sh
pnpm --filter @paulaquiin/lazy-avatars-cli exec node dist/bin.js rack demo-server-01 --theme night --options '{"status":"warn"}' > avatar.svg
pnpm --filter @paulaquiin/lazy-avatars-cli exec node dist/bin.js --help
```

Use the shell's JSON quoting rules; PowerShell single quotes work for these values.
Redirect the Node executable's output directly when exact bytes matter; a package
manager or shell may format output differently. After local tarball installation,
the bin is available through `npm exec -- lazy-avatars ...`.

Arguments: collection ID, seed, then option/value pairs. All thirteen core
collections are supported. Flags: `--size`, `--shape`, `--theme`, `--palette`
(JSON five-role palette/list), `--background true|false`, `--title`, `--idPrefix`,
`--options` (JSON object). Use theme or palette, never both. Duplicates, unknown
flags, invalid JSON and invalid core inputs fail. SVG only goes to stdout, with
no trailing newline. Errors produce a generic stderr diagnostic and exit code 1;
success and `--help` return 0. No seeds or hostnames are logged in diagnostics.

The library export `run(args, {stdout, stderr})` returns the exit code and starts
no process. Runtime baseline: Node 24.11+ on 24.x, or 26+; ESM only.

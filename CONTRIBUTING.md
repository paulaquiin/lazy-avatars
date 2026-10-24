# Contributing / Contribuir

## English

Use Node `^24.11.0 || >=26.0.0` and pnpm 11.25.0. Start with the README,
[architecture](docs/ARCHITECTURE.md), [stable contract](docs/STABILITY.md) and
[repository hygiene](docs/REPOSITORY_HYGIENE.md). Install with
`pnpm install --frozen-lockfile`; use `pnpm dev` for the gallery and
`pnpm --filter @lazy-avatars/integration-examples dev` for adapter examples.

Keep changes focused. Reuse existing checks and add only the smallest meaningful
regression test when behavior changes; avoid duplicate tests, arbitrary coverage
targets and repeated full local runs for documentation/formatting edits. Run the
targeted check first. CI runs the complete existing matrix for merge/release,
including package inventories and the Docker smoke test. Build before standalone
browser/package checks. `pnpm lint` checks style; `pnpm format` applies safe fixes.

Do not refresh snapshots merely to make a failure disappear. Compare the actual
visual change and follow the major-version/outputVersion rules for changes to
existing valid input output. Keep all artwork and glyphs original or document
reviewed third-party rights and notices. Add a changeset for public behavior,
explain the user-visible result, and update both README languages when applicable.

Never commit real seeds/customer data, credentials, local auth configuration,
private tools, assistant state, generated dist, dependencies or tarballs. Stage
explicit paths and inspect the staged diff. Public build/check scripts belong in
`scripts/`; private session tools stay ignored. Report security issues privately
through the maintainer's GitHub profile rather than posting credentials in an
issue. Do not send announcements on behalf of maintainers.

## Español

Usar Node y pnpm fijados, instalar desde el lockfile y leer arquitectura, contrato
estable e higiene del repositorio. `pnpm dev` abre la galería; el paquete de ejemplos
tiene su propio `dev`. Mantener los cambios acotados y las dos versiones del README.

Reutilizar pruebas existentes. Añadir solo la regresión mínima si cambia un
comportamiento; sin duplicados ni objetivos arbitrarios de cobertura. Ejecutar
primero la comprobación afectada y evitar repetir suites completas por cambios
de documentación o formato. El CI completo y Docker siguen siendo requisito de
integración/publicación. No actualizar snapshots sin revisar la diferencia visual
y las reglas de versión mayor/outputVersion. Registrar cambios públicos con
Changesets y conservar los avisos de licencia del arte y dependencias.

No subir datos reales, credenciales, configuración autenticada, herramientas
internas, estado de asistentes, builds, dependencias ni tarballs. Añadir rutas
explícitas y revisar el diff preparado. Los scripts reproducibles del proyecto
son públicos; las utilidades privadas de sesión quedan ignoradas. No publicar
secretos en incidencias ni enviar anuncios sin autorización del mantenedor.

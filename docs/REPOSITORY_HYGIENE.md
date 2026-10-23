# Qué entra en Git y qué se publica

Estado: reglas iniciales, 2026-10-23. El `.gitignore` ya existe; la automatización de CI y los manifiestos npm se implementarán en fase 0. Este documento y la guía son documentación pública: no deben contener notas privadas.

## Git: material del proyecto

Versionar código fuente, pruebas, snapshots deterministas con datos ficticios, recursos visuales revisados y sus licencias, documentación, configuración compartida, workflows y el lockfile de pnpm. Las herramientas de build y pruebas que todo colaborador necesita son parte del proyecto y deben poder reproducirse desde el repositorio.

Excluir credenciales y tokens, archivos `.env` reales, configuraciones de registro autenticadas, llaves, datos de usuarios, volcados de bases de datos, herramientas privadas, instrucciones privadas de asistentes y rutas personales. También se excluyen dependencias instaladas, builds, cobertura, cachés, logs, paquetes y exportaciones temporales.

El [.gitignore](../.gitignore) cubre nombres y directorios habituales, incluidos `.codex/`, `.agents/`, `.tools/`, `internal/` y `tools/internal/`. Colocar herramientas privadas dentro de esos directorios; un nombre arbitrario no queda protegido automáticamente. Los scripts públicos necesarios para build o CI deben vivir, por ejemplo, en `scripts/`, sin credenciales ni rutas de una máquina concreta.

Solo se admiten `.env.example` o `.env.*.example` con valores ficticios. No copiar configuraciones reales para crear ejemplos. Si se necesita configuración compartida de pnpm, revisar qué archivo se puede versionar sin datos de autenticación y ajustar la exclusión de forma explícita.

## Revisión antes de un commit o push

1. Consultar `git status --short --untracked-files=all` y revisar archivos nuevos por nombre y contenido. Añadir rutas explícitas cuando sea posible.
2. Comprobar rutas privadas concretas con `git check-ignore -v --no-index -- RUTA`. Confirmar que fuente, tests, snapshots y licencias que sí necesitamos siguen visibles.
3. Revisar `git diff --cached --name-status`, `git diff --cached --check` y `git diff --cached`. Los archivos nuevos sin preparar aún no aparecen en ese diff.
4. Ejecutar la detección de secretos en CI cuando esté incorporada, incluyendo el historial que vaya a enviarse. No sustituye la revisión manual.
5. Hacer el push únicamente al destino previsto y revisar que no se incluyen archivos o commits ajenos al proyecto.

No usar `git add -f` sobre exclusiones privadas sin revisar y retirar el contenido sensible. `.gitignore` no elimina archivos ya versionados ni detecta secretos dentro de un archivo permitido. Si aparece una credencial ya distribuida, revocarla o rotarla y sanear su exposición; borrarla de la última versión no la retira del historial.

## npm: publicar menos que Git

El repositorio incluye código y herramientas de desarrollo públicos; el paquete de consumo solo incluirá los archivos necesarios para usarlo y cumplir sus licencias.

- Marcar la raíz y `apps/gallery` con `private: true` cuando se creen sus manifiestos.
- Usar `files` como lista positiva en cada paquete publicable: salida `dist`, README, LICENSE y avisos de terceros aplicables. No confiar solo en `.npmignore` o en `.gitignore`.
- Revisar `package.json` y todos los archivos incluidos por npm, también los que npm añade automáticamente.
- Revisar el inventario con `npm pack --dry-run --json` desde cada paquete, después de compilar. Verificar que los destinos de `exports` existen y que el paquete instalado funciona fuera del monorepo.
- Impedir en CI que el paquete contenga secretos, herramientas internas, fuentes ajenas, datos privados, cachés, pruebas o exportaciones locales. Revisar los source maps si se decide distribuirlos.
- No publicar tokens en archivos ni scripts. Usar el mecanismo de identidad o secretos del proveedor elegido, con permisos mínimos. El flujo de publicación se configurará y verificará antes de la primera versión.

## Semillas y galería

Los nombres, emails y hostnames pueden identificar personas o infraestructura. La galería guarda la semilla en la URL: compartir esa URL comparte ese dato. Usar únicamente ejemplos ficticios en documentación, capturas, snapshots e incidencias públicas. Los IDs de SVG y el hash de la semilla no deben considerarse mecanismos de anonimización.

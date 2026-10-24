# Primera publicación · v0.1.0

Estado al 2026-10-24: paquete preparado y verificado; sesión npm autenticada.
El primer intento de publicación devuelve `E403`: npm exige autenticación de dos
factores para publicar. v0.1.0 todavía no está publicada y no hay tag de release.
El CI completo y Pages del commit `b5fc39c` han pasado.
No confundir un commit subido o una galería desplegada con una publicación npm.

## Publicar desde una sesión autenticada

1. Iniciar sesión con `npm login` en una terminal del mantenedor. No copiar tokens,
   contraseñas ni códigos de recuperación al repositorio o a un chat. `.npmrc`
   está excluido por Git; no usar una configuración autenticada como ejemplo.
2. Activar 2FA en la cuenta npm y completar cualquier desafío en el navegador o
   terminal del mantenedor, sin copiar códigos al chat. Véase la
   [configuración oficial de 2FA](https://docs.npmjs.com/configuring-two-factor-authentication/).
   Verificar `npm whoami`, la cuenta elegida y la disponibilidad del nombre
   `lazy-avatars`. Un error de autorización o red no prueba disponibilidad.
3. Comprobar árbol limpio, `main` sincronizada y CI verde para el commit exacto.
   Instalar desde lockfile y ejecutar `pnpm check`; revisar LICENSE y CHANGELOG.
4. Revisar `pnpm check:package`: inventario positivo, grafos de importación,
   ausencia de dependencias de ejecución, instalación aislada y tipos públicos.
5. Desde `packages/core`, ejecutar `npm pack --dry-run --json` y comprobar que
   no hay herramientas internas, fuentes de desarrollo, fixtures, credenciales,
   mapas de fuentes, logs ni archivos ajenos. Ejecutar después
   `npm publish --access public`, completando la autenticación que solicite npm.
6. Verificar `npm view lazy-avatars@0.1.0 version dist.integrity` e instalar esa
   versión desde el registro en una carpeta vacía. Probar el motor y las cuatro
   subrutas, sin depender del workspace.
7. Solo tras confirmar la publicación, etiquetar el commit publicado con
   `git tag v0.1.0` y subirlo con `git push origin v0.1.0`. Actualizar el estado de
   publicación de los README y la guía para reflejar el resultado comprobado.

Para siguientes versiones: añadir un changeset, ejecutar `pnpm changeset version`
y revisar los cambios antes del mismo procedimiento. No republicar una versión
ya existente ni considerar `outputVersion` un selector de renderizadores pasados.

## GitHub Pages

El workflow CI publica únicamente `apps/gallery/dist` desde `main` cuando pasan
los tres trabajos de comprobación. El job de despliegue tiene permisos mínimos
de Pages/OIDC y no usa un token guardado en el repositorio. Las pull requests
ejecutan comprobaciones pero no despliegan. Confirmar el último despliegue y sus
assets en [la galería](https://paulaquiin.github.io/lazy-avatars/) antes de anunciarlo.

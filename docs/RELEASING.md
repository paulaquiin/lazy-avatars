# Primera publicación · v0.1.0

Estado al 2026-10-24: [lazy-avatars@0.1.0](https://www.npmjs.com/package/lazy-avatars/v/0.1.0)
publicada y comprobada desde el registro público. La autorización 2FA se completó
en el navegador del mantenedor; no se guardaron credenciales en Git.
- Commit publicado y tag `v0.1.0`: `5642202739582d539c535ed0373330fcccd286d3`.
- [CI del commit publicado](https://github.com/paulaquiin/lazy-avatars/actions/runs/40091913799): matriz Linux/Node 24.11 y 26, Windows/Node 24 y Pages en verde.
- `latest` apunta a `0.1.0`; instalación real con caché nueva fuera del workspace.
- Motor y cuatro subrutas ESM, SVG, URI de datos, determinismo y tipos públicos comprobados.
- Tarball: 18 archivos permitidos, sin dependencias de ejecución. Su integridad coincide con el paquete local revisado:

```text
sha512-oh33QwixRHHLQc0QdfKZH48pT69drZHwt664JHD8zhheh0ZaDSt3YE+h7vsdlUeamYxM7hHLy7Xx33NOd9RU0g==
```

npm puede confirmar el envío antes de que la versión esté disponible. Esperar a
que el registro sirva la versión y comprobar su instalación antes de etiquetar;
no repetir una publicación aceptada mientras se procesa.

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

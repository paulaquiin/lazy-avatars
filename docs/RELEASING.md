# Publicaciones de lazy-avatars

## v1.0.0 · publicada

Publicada el 2026-10-24 con autorización de cuenta npm. Núcleo y cuatro adaptadores
bajo @paulaquiin; `latest` apunta a 1.0.0 en los cinco paquetes.
- Commit publicado y tag `v1.0.0`: `d5d7c431153eb9d5ea9f542e92cceaaec38f9870`.
- [CI del commit publicado](https://github.com/paulaquiin/lazy-avatars/actions/runs/40133844169): Linux/Node 24.11 y 26, Windows/Node 24, Docker y Pages aprobados.
- Sin cambios del motor, colecciones o 260 snapshots de 0.3.0. No se añadieron pruebas.
- Cada payload publicado coincide con los archivos revisados; integridad SHA-512 validada. pnpm no añadió gitHead a los metadatos npm: el origen queda acreditado por esta comparación, el commit y el tag.
- Instalación desde el registro en carpeta vacía y caché nueva: cinco paquetes, trece colecciones, SVG/URI/determinismo, exports de adaptadores, SSR, tipos públicos y CLI mediante npm exec aprobados.
- [Registro de versiones e integridades](releases/v1.0.0.json). Los adaptadores se publicaron con pnpm, resolviendo workspace a ^1.0.0.
- [Contrato/migración](STABILITY.md), [compatibilidad y medidas](COMPATIBILITY.md), [marca original MIT](../assets/brand/README.md), [anuncio solo como borrador](ANNOUNCEMENT.md).

| Paquete 1.0.0                                                                                                          | Archivos permitidos | Bytes tarball |
| ---------------------------------------------------------------------------------------------------------------------- | ------------------: | ------------: |
| [lazy-avatars](https://www.npmjs.com/package/lazy-avatars/v/1.0.0)                                                     |                  36 |         25784 |
| [@paulaquiin/lazy-avatars-react](https://www.npmjs.com/package/@paulaquiin/lazy-avatars-react/v/1.0.0)                 |                   6 |          2960 |
| [@paulaquiin/lazy-avatars-web-component](https://www.npmjs.com/package/@paulaquiin/lazy-avatars-web-component/v/1.0.0) |                   6 |          3867 |
| [@paulaquiin/lazy-avatars-cli](https://www.npmjs.com/package/@paulaquiin/lazy-avatars-cli/v/1.0.0)                     |                   8 |          3987 |
| [@paulaquiin/lazy-avatars-http](https://www.npmjs.com/package/@paulaquiin/lazy-avatars-http/v/1.0.0)                   |                   8 |          5406 |

Sin credenciales, herramientas internas, builds de desarrollo ni archivos ajenos
en Git o en los paquetes. No se publica un servicio HTTP ni se envía el anuncio.

## v0.3.0 · publicada

Publicada el 2026-10-24 tras autorización 2FA del mantenedor. Trece colecciones;
motor y 180 snapshots de las nueve colecciones anteriores intactos.
- [Paquete npm](https://www.npmjs.com/package/lazy-avatars/v/0.3.0); en su publicación, `latest` apuntaba a `0.3.0`.
- Commit publicado y tag `v0.3.0`: `2e95df87d40f381f2f30ef5e272926f1e46da647`.
- [CI del commit publicado](https://github.com/paulaquiin/lazy-avatars/actions/runs/40097531749): Linux/Node 24.11 y 26, Windows/Node 24 y Pages aprobados.
- 117 pruebas unitarias y 26 de Chromium aprobadas; galería pública comprobada con las trece colecciones y comparación espacial en móvil.
- Instalación desde npm en carpeta vacía y caché nueva: trece subrutas ESM, SVG, URI de datos, determinismo y declaraciones TypeScript comprobados.
- 36 archivos permitidos; 25 175 bytes comprimidos / 89 044 bytes descomprimidos; sin dependencias de ejecución, credenciales ni herramientas internas.
- Integridad idéntica al tarball local revisado:

```text
sha512-K3wruex13D7acmYaqZGbc5Ft8mStnHZ1okamqicpuKSCkiiqYEdZ4E+GCmLRKTnL9+Z2VFznpJpnfIVemNIcqg==
```

Evidencia y límites en [PHASE3_REVIEW.md](PHASE3_REVIEW.md).

## v0.2.0 · publicada

Publicada el 2026-10-24 tras autorización 2FA del mantenedor. Nueve colecciones;
motor y los 80 snapshots de las cuatro colecciones anteriores intactos.
- [Paquete npm](https://www.npmjs.com/package/lazy-avatars/v/0.2.0); en su publicación, `latest` apuntaba a `0.2.0`.
- Commit publicado y tag `v0.2.0`: `5f71c88555689abf839123ef36fc498e78705ba8`.
- [CI del commit publicado](https://github.com/paulaquiin/lazy-avatars/actions/runs/40094477852): Linux/Node 24.11 y 26, Windows/Node 24 y Pages aprobados.
- Instalación desde npm en carpeta vacía y caché nueva; nueve subrutas ESM, SVG, URI de datos, determinismo y declaraciones TypeScript comprobados.
- 28 archivos permitidos; 19 761 bytes comprimidos / 65 382 bytes descomprimidos; sin dependencias de ejecución ni credenciales.
- Integridad idéntica al tarball local revisado:

```text
sha512-NBDzn6YWjE0XLdJJjpJEd4fEiikPHWsYP7cLG4RgwOw27DlIwcNM3m3w2/PCjO8QcYynMGRc9Crno44l8Zr0Dw==
```

## v0.1.0 · publicada

Estado al 2026-10-24: [lazy-avatars@0.1.0](https://www.npmjs.com/package/lazy-avatars/v/0.1.0)
publicada y comprobada desde el registro público. La autorización 2FA se completó
en el navegador del mantenedor; no se guardaron credenciales en Git.
- Commit publicado y tag `v0.1.0`: `5642202739582d539c535ed0373330fcccd286d3`.
- [CI del commit publicado](https://github.com/paulaquiin/lazy-avatars/actions/runs/40091913799): matriz Linux/Node 24.11 y 26, Windows/Node 24 y Pages en verde.
- En su publicación, `latest` apuntaba a `0.1.0`; instalación real con caché nueva fuera del workspace.
- Motor y cuatro subrutas ESM, SVG, URI de datos, determinismo y tipos públicos comprobados.
- Tarball: 18 archivos permitidos, sin dependencias de ejecución. Su integridad coincide con el paquete local revisado:

```text
sha512-oh33QwixRHHLQc0QdfKZH48pT69drZHwt664JHD8zhheh0ZaDSt3YE+h7vsdlUeamYxM7hHLy7Xx33NOd9RU0g==
```

npm puede confirmar el envío antes de que la versión esté disponible. Esperar a
que el registro sirva la versión y comprobar su instalación antes de etiquetar;
no repetir una publicación aceptada mientras se procesa.

## Procedimiento de publicación

1. Iniciar sesión con `npm login` en una terminal del mantenedor. No copiar tokens,
   contraseñas ni códigos de recuperación al repositorio o a un chat. `.npmrc`
   está excluido por Git; no usar una configuración autenticada como ejemplo.
2. Activar 2FA en la cuenta npm y completar cualquier desafío en el navegador o
   terminal del mantenedor, sin copiar códigos al chat. Véase la
   [configuración oficial de 2FA](https://docs.npmjs.com/configuring-two-factor-authentication/).
   Verificar `npm whoami`, la cuenta elegida y que la versión objetivo de
   `lazy-avatars` no existe ya. Un error de autorización o red no prueba disponibilidad.
3. Comprobar árbol limpio, `main` sincronizada y CI verde para el commit exacto.
   Instalar desde lockfile y ejecutar `pnpm check`; revisar LICENSE y CHANGELOG.
4. Revisar `pnpm check:package`: inventario positivo, grafos de importación,
   ausencia de dependencias de ejecución, instalación aislada y tipos públicos.
5. Desde `packages/core`, ejecutar `npm pack --dry-run --json` y comprobar que
   no hay herramientas internas, fuentes de desarrollo, fixtures, credenciales,
   mapas de fuentes, logs ni archivos ajenos. Ejecutar después
   `npm publish --access public`, completando la autenticación que solicite npm.
6. Verificar `npm view lazy-avatars@0.3.0 version dist.integrity` e instalar esa
   versión desde el registro en una carpeta vacía. Usar la versión objetivo en
   estos comandos (por ejemplo `0.3.0` y `v0.3.0` para fase 3). Probar el motor y las trece
   subrutas, sin depender del workspace.
7. Solo tras confirmar la publicación, etiquetar el commit publicado con
   `git tag v0.3.0` y subirlo con `git push origin v0.3.0`. Actualizar el estado de
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

# Integraciones · fase 4

Los cuatro adaptadores están preparados en el workspace y se verifican instalados
desde tarballs fuera del monorepo. Todavía no están publicados en npm: el scope
`@lazy-avatars` es provisional y debe acreditarse antes de publicar. El núcleo
publicado sigue siendo `lazy-avatars@0.3.0`, con trece colecciones y salida intacta.
La fase 4 exige distribuciones revisadas y ejemplos ejecutables; no publica una
API de imágenes alojada por el proyecto.

| Integración   | Paquete preparado                   | Dependencias de ejecución      | Ejemplo y contrato                            |
| ------------- | ----------------------------------- | ------------------------------ | --------------------------------------------- |
| React         | `@lazy-avatars/react@0.1.0`         | React 19 y núcleo como peers   | [README](../packages/react/README.md)         |
| Web component | `@lazy-avatars/web-component@0.1.0` | Núcleo como peer               | [README](../packages/web-component/README.md) |
| CLI           | `@lazy-avatars/cli@0.1.0`           | Núcleo                         | [README](../packages/cli/README.md)           |
| HTTP          | `@lazy-avatars/http@0.1.0`          | Núcleo y módulos estándar Node | [README y Docker](../packages/http/README.md) |

## Ejecutar desde un checkout

```sh
pnpm install --frozen-lockfile
pnpm build
pnpm --filter @lazy-avatars/integration-examples preview
pnpm --filter @lazy-avatars/cli exec node dist/bin.js rack demo-server-01
pnpm --filter @lazy-avatars/http exec node dist/bin.js
```

El primer ejemplo sirve una página con HTML React generado durante el build e
hidratado en el navegador, tres avatares repetidos y dos web components. El botón
cambia la semilla tras la hidratación. Los elementos registran explícitamente
Órbita y Rack. Los ejemplos usan identidades ficticias y no solicitan imágenes
ni fuentes externas. Para iterar con Vite, usar el script `dev` del mismo paquete.

La CLI imprime únicamente SVG al invocar su bin con Node. Para redirigir bytes
sin mensajes del gestor, ejecutar `node packages/cli/dist/bin.js rack demo-server-01 > avatar.svg`.
Las reglas de codificación/redirección del shell siguen siendo aplicables.
HTTP escucha por defecto en `127.0.0.1:3000`; comprobar
`http://127.0.0.1:3000/rack/demo-server-01.svg`. No se inicia al importar su módulo.

## Tarballs de consumo

Desde cada directorio de paquete, `pnpm pack --out <ruta-de-salida>.tgz` genera su
distribución con las referencias `workspace:` resueltas. No usar `npm pack` para
los adaptadores con dependencias workspace sin esa resolución. Instalar primero
el núcleo y React cuando corresponda, y después los tarballs locales. El script
`pnpm check:integrations` hace esta prueba de forma aislada, usando el almacén de
dependencias ya instalado y una sustitución temporal para asegurar que todos los
adaptadores usan el tarball del núcleo revisado, sin obtener otra versión de red.

Cada adaptador tiene inventario positivo: README, MIT, manifiesto y entradas ESM
con tipos; CLI/HTTP añaden su bin con shebang. Son 5/5/7/7 archivos respectivamente.
La comprobación revisa patrones de credenciales, dependencias, ausencia de arte
del núcleo embebido, imports, SVG, SSR, CLI ejecutable y declaraciones TypeScript.
Builds, tarballs, capturas y herramientas privadas permanecen fuera de Git.

## Paleta personalizada

La galería permite activar cinco colores `background`, `primary`, `secondary`,
`accent`, `ink`, con formato `#RGB` o `#RRGGBB`. Sustituye al tema cuando está
activada. Muestra los colores, ratios de contraste frente al fondo y avisos de
alcance; no afirma certificar accesibilidad. El SVG y el código copiado reciben
la misma paleta. Valores inválidos desactivan la descarga y limpian la muestra.
La URL conserva colores y estado, incluidos errores para poder corregirlos.
Con transparencia hay que revisar la superficie real de la aplicación.

## Validación y límites

`pnpm check` incluye 123 pruebas unitarias, 29 de Chromium, los 260 snapshots de
colecciones y la figura del motor, instalación aislada del núcleo y de los cuatro
adaptadores. La hidratación conserva el DOM SSR, IDs únicos y accesibilidad;
el web component aísla referencias en shadow roots y se recupera de errores.
CLI/HTTP comparan SVG con el núcleo y rechazan entradas inválidas. Sus formatos
de transporte son estrictos; el núcleo sigue validando los valores efectivos.

React usa `useId` con escape reversible: varias raíces requieren prefijos
distintos y coherentes entre SSR/cliente. El core limita el prefijo a 64 caracteres.
Los componentes de colección son código de confianza, no plantillas SVG externas.
Las URL HTTP/galería contienen semillas: no son anónimas. HTTP no registra URLs,
pero el operador debe revisar sus proxies y logs. Las políticas de caché y límites
de HTTP se detallan en su README.

`pnpm check:docker` construye y arranca una imagen sin permisos root y con sistema
de archivos de solo lectura. Comprueba salud, MIME, SVG exacto, rechazo de opciones
y uid. El workflow exige esta prueba en Linux antes de desplegar Pages. El motor
Docker local no estaba disponible; la imagen se construyó y arrancó correctamente
en [CI Linux](https://github.com/paulaquiin/lazy-avatars/actions/runs/40130418438/job/120981016230).
No se publica imagen ni se despliega un servicio.

Referencias de implementación: [IDs e hidratación de React](https://react.dev/reference/react/useId)
y [ciclo de vida de custom elements](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements).

La matriz remota cubre Linux/Node 24.11 y 26, y Windows/Node 24. El resultado de
cada commit y su despliegue de Pages se consulta en [CI](https://github.com/paulaquiin/lazy-avatars/actions/workflows/ci.yml).
Los 260 snapshots anteriores y el código del núcleo 0.3.0 siguen intactos.

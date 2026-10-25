# Self-hosted HTTP · lazy-avatars/http

Prepared for lazy-avatars 1.1.0 (not yet published). Uses Node standard modules,
no React or runtime dependencies. No project-hosted public image API is deployed.

```sh
npx --package=lazy-avatars@1.1.0 lazy-avatars-http
# Or from checkout:
node packages/core/dist/http-bin.js
# Docker, from repository root:
docker build -f packages/core/Dockerfile -t lazy-avatars-http .
docker run --rm --read-only --cap-drop=ALL --security-opt=no-new-privileges -p 127.0.0.1:3000:3000 lazy-avatars-http
```

```ts
import { createAvatarServer } from 'lazy-avatars/http';
createAvatarServer().listen(3000, '127.0.0.1');
```

Import starts no listener. Bin defaults: HOST=127.0.0.1, PORT=3000; valid port
1–65535. SIGINT/SIGTERM stop gracefully, closing remaining connections in five
seconds. GET/HEAD /<collection>/<percent-encoded-seed>.svg render thirteen styles.
Query keys: size, shape, theme or palette(JSON), background=true|false, title,
idPrefix, options(JSON). Duplicate/unknown keys and invalid core inputs fail.
GET/HEAD /healthz reports readiness. Request target: max 4096 characters; headers:
16 KiB/100 fields; bodies rejected. No filesystem paths or external SVG resources.

Success: image/svg+xml; charset=utf-8, byte length, SHA-256 ETag and private,
max-age=3600, must-revalidate cache. If-None-Match supports lists, weak tags and *;
returns 304. HEAD omits the body. Errors: no-store with generic status body;
400 invalid input, 404 route/collection, 405 method with Allow, 413 body, 414 long
URL. Nosniff, no-referrer and restrictive CSP headers. Requests/headers timeout
10s, keep-alive 5s, 100 requests/socket. No unbounded memory cache or request logs.
Upstream logs still contain seed URLs; configure authentication, TLS and rate limits
at the deployment boundary as needed. Docker uses a pinned base, positive build
context, non-root uid and read-only runtime. pnpm check:docker verifies startup/MIME.

Servidor autoalojable en el paquete único. API, límites, caché, cabeceras y Docker
conservados; no se inicia al importar /http ni se despliega un servicio público.

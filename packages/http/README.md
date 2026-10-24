# @paulaquiin/lazy-avatars-http

Self-hosted SVG HTTP server, version 1.0.0. MIT. No public project image API
is deployed. Its only runtime dependency is lazy-avatars ^1.0.0.

```sh
npx @paulaquiin/lazy-avatars-http@1.0.0
```

After `pnpm build`, run locally:

```sh
pnpm --filter @paulaquiin/lazy-avatars-http exec node dist/bin.js
curl 'http://127.0.0.1:3000/rack/demo-server-01.svg?theme=night&options=%7B%22status%22%3A%22warn%22%7D'
```

The bin defaults to `127.0.0.1:3000`. `HOST` and `PORT` configure binding; PORT
must be an integer 1–65535. SIGINT/SIGTERM close the listener and idle connections;
remaining connections close within five seconds. The library's
`createAvatarServer()` returns an inert Node server: call `.listen()` yourself.

## Contract

`GET` and `HEAD /<collection>/<percent-encoded-seed>.svg` render any of the
thirteen collections. Query keys: `size`, `shape`, `theme`, `palette` (JSON),
`background=true|false`, `title`, `idPrefix`, `options` (JSON). Core defaults and
limits apply. Theme and palette are mutually exclusive. Duplicate or unknown
keys fail. Encode seeds and JSON with `encodeURIComponent` / `URLSearchParams`.
The transport additionally limits the entire request target to 4096 characters,
headers to 16 KiB and 100 fields, and rejects request bodies. No filesystem paths,
remote resources or arbitrary SVG are accepted. Health: `GET/HEAD /healthz`.

Success returns `image/svg+xml; charset=utf-8`, byte length, a SHA-256 ETag and
`Cache-Control: private, max-age=3600, must-revalidate`. `If-None-Match` supports
lists, weak tags and `*`, yielding 304. HEAD has the same success headers without
a body. There is no unbounded in-memory avatar cache. Errors use `no-store` and
generic numeric bodies: 400 invalid input, 404 unknown route/collection, 405
unsupported method (`Allow: GET, HEAD`), 413 body, 414 long target. Node enforces
header limits separately. Responses include nosniff, no-referrer and a restrictive
CSP. Timeouts: requests/headers 10 seconds, keep-alive 5 seconds; 100 requests/socket.

URLs contain seeds. Keep upstream access logs private or disable them; hashing
is not anonymization. This server itself writes no request/seed logs. No CORS,
authentication, TLS termination or rate limiter is provided. Configure a reverse
proxy and resource limits to suit a deployment. No third-party collection upload
or template execution exists.

## Docker

From the repository root:

```sh
docker build -f packages/http/Dockerfile -t lazy-avatars-http .
docker run --rm --read-only --cap-drop=ALL --security-opt=no-new-privileges -p 127.0.0.1:3000:3000 lazy-avatars-http
pnpm check:docker
```

The official Node base is pinned by version and digest. A positive `.dockerignore`
excludes credentials, private tools, Git, node_modules and local build output from
the daemon context. Build dependencies stay in a separate stage. The runtime
installs only reviewed core/HTTP tarballs, runs as uid 1000, binds 0.0.0.0:3000
inside the container and provides a healthcheck. No volume or writable filesystem
is needed. CI starts the image with a read-only filesystem, checks health, SVG
bytes/MIME, invalid input and uid, then stops it. No image is pushed to a registry.

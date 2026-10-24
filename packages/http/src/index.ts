import { createHash } from 'node:crypto';
import type { Server } from 'node:http';
import { createServer } from 'node:http';
import { getCollection } from '../../../shared/catalogue.js';
import { renderInput } from '../../../shared/input.js';

/** No listener starts until the caller invokes listen(). No seed or URL is logged. */
export function createAvatarServer(): Server {
  const server = createServer({ maxHeaderSize: 16 * 1024 }, (request, response) => {
    response.setHeader('X-Content-Type-Options', 'nosniff');
    response.setHeader('Content-Security-Policy', "default-src 'none'; sandbox");
    response.setHeader('Referrer-Policy', 'no-referrer');
    response.setHeader('Cache-Control', 'no-store');
    const fail = (status: number) => {
      response.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8' });
      response.end(request.method === 'HEAD' ? undefined : `${status}\n`);
    };
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      response.setHeader('Allow', 'GET, HEAD');
      fail(405);
      return;
    }
    if (
      request.headers['transfer-encoding'] ||
      (request.headers['content-length'] && request.headers['content-length'] !== '0')
    ) {
      response.setHeader('Connection', 'close');
      fail(413);
      return;
    }
    const raw = request.url ?? '';
    if (raw.length > 4096) {
      fail(414);
      return;
    }
    if (raw === '/healthz') {
      response.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
      response.end(request.method === 'HEAD' ? undefined : 'ok\n');
      return;
    }
    const match = /^\/([a-z]+)\/([^/?#]+)\.svg(?:\?([^#]*))?$/.exec(raw);
    if (!match) {
      fail(404);
      return;
    }
    let collection: ReturnType<typeof getCollection>;
    try {
      collection = getCollection(match[1] ?? '');
    } catch {
      fail(404);
      return;
    }
    try {
      const seed = decodeURIComponent(match[2] ?? '');
      const svg = renderInput(collection, seed, new URLSearchParams(match[3]));
      const etag = `"${createHash('sha256').update(svg).digest('hex')}"`;
      response.setHeader('ETag', etag);
      response.setHeader('Cache-Control', 'private, max-age=3600, must-revalidate');
      response.setHeader('Content-Type', 'image/svg+xml; charset=utf-8');
      const conditions = request.headers['if-none-match']
        ?.split(',')
        .map((x) => x.trim().replace(/^W\//, ''));
      if (conditions?.includes(etag) || conditions?.includes('*')) {
        response.writeHead(304);
        response.end();
        return;
      }
      response.setHeader('Content-Length', Buffer.byteLength(svg));
      response.writeHead(200);
      response.end(request.method === 'HEAD' ? undefined : svg);
    } catch {
      fail(400);
    }
  });
  server.requestTimeout = 10_000;
  server.headersTimeout = 10_000;
  server.keepAliveTimeout = 5_000;
  server.maxRequestsPerSocket = 100;
  server.maxHeadersCount = 100;
  return server;
}

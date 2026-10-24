#!/usr/bin/env node
import { createAvatarServer } from './index.js';

const port = process.env.PORT ?? '3000';
if (!/^\d{1,5}$/.test(port) || Number(port) < 1 || Number(port) > 65535) {
  process.stderr.write('PORT must be an integer from 1 to 65535\n');
  process.exitCode = 1;
} else {
  const server = createAvatarServer();
  server.on('error', () => {
    process.stderr.write('Cannot start avatar server\n');
    process.exitCode = 1;
  });
  server.listen(Number(port), process.env.HOST ?? '127.0.0.1');
  for (const signal of ['SIGTERM', 'SIGINT'] as const)
    process.once(signal, () => {
      server.close();
      server.closeIdleConnections();
      setTimeout(() => server.closeAllConnections(), 5_000).unref();
    });
}

#!/usr/bin/env node
import { run } from './index.js';

process.exitCode = run(process.argv.slice(2), {
  stdout: (value) => {
    process.stdout.write(value);
  },
  stderr: (value) => {
    process.stderr.write(value);
  },
});

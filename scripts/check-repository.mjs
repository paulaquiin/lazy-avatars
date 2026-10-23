import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const privatePath =
  /(?:^|\/)(?:node_modules|dist|build|coverage|\.codex|\.agents|\.claude|\.cursor|\.aws|\.ssh|\.gnupg|\.secrets|\.internal|\.tools|internal|playwright-report|test-results)(?:\/|$)|(?:^|\/)tools\/(?:internal|private|local)\//;
const privateFile =
  /(?:^|\/)(?:\.npmrc|\.pnpmrc|credentials\.json|secrets\.json)$|\.(?:pem|key|p12|pfx|jks|keystore|tgz|log)$/i;

export function isPrivatePath(path) {
  const normalized = path.replaceAll('\\', '/');
  const base = normalized.split('/').at(-1) ?? '';
  const realEnvironment = (base === '.env' || base.startsWith('.env.')) && !/\.example$/.test(base);
  return privatePath.test(normalized) || privateFile.test(normalized) || realEnvironment;
}

export function findSecretKinds(text) {
  const rules = [
    ['private key', /-----BEGIN (?:RSA |EC |OPENSSH |DSA |ENCRYPTED )?PRIVATE KEY-----/],
    ['GitHub token', /\b(?:gh[pousr]_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,})\b/],
    ['AWS access key', /\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/],
    [
      'service token',
      /\b(?:sk-(?:proj-)?[A-Za-z0-9_-]{24,}|npm_[A-Za-z0-9]{30,}|xox[baprs]-[A-Za-z0-9-]{20,})\b/,
    ],
    [
      'assigned credential',
      /(?:api[_-]?key|access[_-]?token|auth[_-]?token|client[_-]?secret|password|passwd)["']?\s*[:=]\s*["'][A-Za-z0-9/+_=-]{16,}["']/i,
    ],
    ['authenticated URL', /https?:\/\/[^\s/@:]+:[^\s/@]+@/i],
  ];
  return rules.filter(([, pattern]) => pattern.test(text)).map(([kind]) => kind);
}

export function checkRepository() {
  const paths = execFileSync(
    'git',
    ['ls-files', '-z', '--cached', '--others', '--exclude-standard'],
    { encoding: 'utf8' },
  )
    .split('\0')
    .filter(Boolean);
  const problems = [];
  for (const path of new Set(paths)) {
    if (isPrivatePath(path)) problems.push(`${path}: private or generated path`);
    const bytes = readFileSync(path);
    if (bytes.includes(0)) continue;
    for (const kind of findSecretKinds(bytes.toString('utf8')))
      problems.push(`${path}: ${kind} pattern`);
  }
  // With fetch-depth: 0 in CI this also catches credentials removed in later commits.
  const history = execFileSync('git', ['log', '--all', '--format=', '-p', '--no-ext-diff'], {
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
  });
  for (const kind of findSecretKinds(history)) problems.push(`Git history: ${kind} pattern`);
  if (problems.length)
    throw new Error(`Repository checks failed (values omitted):\n${problems.join('\n')}`);
  console.log(
    `Repository hygiene: ${new Set(paths).size} files and available Git history checked.`,
  );
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) checkRepository();

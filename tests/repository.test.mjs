import { describe, expect, it } from 'vitest';
import { findSecretKinds, isPrivatePath } from '../scripts/check-repository.mjs';

describe('public repository checks', () => {
  it('rejects private locations while preserving public project tooling', () => {
    for (const path of [
      '.codex/state.json',
      'tools/internal/script.ps1',
      '.env.production',
      'packages/core/dist/index.js',
      '.aws/credentials',
      'key.pem',
    ])
      expect(isPrivatePath(path)).toBe(true);
    for (const path of [
      'scripts/check-package.mjs',
      'pnpm-lock.yaml',
      '.env.example',
      '.github/workflows/ci.yml',
      'packages/core/src/index.ts',
    ])
      expect(isPrivatePath(path)).toBe(false);
  });

  it('reports credential kinds without copying their values', () => {
    const token = ['ghp', '_', 'x'.repeat(36)].join('');
    const key = ['-----BEGIN ', 'PRIVATE KEY-----'].join('');
    expect(findSecretKinds(token)).toEqual(['GitHub token']);
    expect(findSecretKinds(key)).toEqual(['private key']);
    expect(findSecretKinds(`const apiKey = "${'x'.repeat(24)}"`)).toEqual(['assigned credential']);
    expect(findSecretKinds('seed: "demo-server-01"')).toEqual([]);
  });
});

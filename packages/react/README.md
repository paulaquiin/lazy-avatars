# @lazy-avatars/react

React 19 adapter for `lazy-avatars`. MIT. Prepared as a local tarball; not published
to npm. The `@lazy-avatars` scope remains provisional. React and the core are peer
dependencies; this package bundles neither React nor collection artwork.

```tsx
import { Avatar } from '@lazy-avatars/react';
import { rack } from 'lazy-avatars/rack';

<Avatar
  collection={rack}
  seed="demo-server-01"
  title="Demo server: warning"
  options={{ status: 'warn' }}
  size={32}
/>;
```

`AvatarProps<O>` retains the collection's option types. All core options are
accepted, plus `className` and `style` on an inline-flex span. Its SVG is produced
by the core. A title gives the SVG an accessible name; without one it is
decorative. Do not add competing labels to the wrapper. Use textual status labels
beside Rack LEDs. Registered collection implementations are trusted code.

`useId` supplies an escaped instance prefix for SVG references. SSR and hydration
must use the same tree and `identifierPrefix`. For independent React roots, give
each root a different `identifierPrefix`, consistently on server and client.
The escaped ID must fit the core's 64-character limit; keep root prefixes short.
An explicit `idPrefix` overrides automatic isolation: ensure it is unique yourself.
This is a synchronous Client Component, not an async React Server Component.

The distributed entry preserves `"use client"`. The SSR/hydration example lives in
`apps/integrations`, builds via `pnpm build`, and runs with
`pnpm --filter @lazy-avatars/integration-examples preview`. React 19.3.1 is tested.
The core and previous collection output remain unchanged.

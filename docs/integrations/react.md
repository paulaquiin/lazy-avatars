# React · lazy-avatars/react

Available in lazy-avatars 1.1.0, published on npm. Install the single package and
React 19; React is an optional peer, not installed for core-only users.

```sh
npm install lazy-avatars@1.1.0 react@19
```

```tsx
import { Avatar } from 'lazy-avatars/react';
import { rack } from 'lazy-avatars/rack';
<Avatar
  collection={rack}
  seed="demo-server-01"
  title="Demo server: warning"
  options={{ status: 'warn' }}
  size={32}
/>;
```

AvatarProps retains collection option types and all core options, plus className
and style on the inline-flex wrapper. SVG accessibility comes from the core:
title creates an accessible name, otherwise the SVG is decorative. Use textual
status labels beside Rack LEDs. Collection renderers remain trusted code.

useId supplies escaped, stable per-instance prefixes. SSR/hydration must use the
same tree and identifierPrefix. Independent roots need distinct matching prefixes.
The escaped prefix must fit the 64-character core limit. Explicit idPrefix overrides
automation and must be unique. Synchronous Client Component, not an async Server
Component; its entry preserves "use client". Public types need React's type package
in TypeScript projects. Example: apps/integrations (SSR and hydration).

Una sola dependencia del proyecto: lazy-avatars; añade React solo si usas esta
entrada. No cambia la API Avatar ni el SVG. IDs por instancia y SSR conservados.

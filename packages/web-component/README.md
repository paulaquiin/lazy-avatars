# @lazy-avatars/web-component

Native custom element with explicit artwork registration. MIT. Prepared as a local
tarball, not published to npm; the `@lazy-avatars` scope remains provisional.
The core is a peer dependency. Importing this module is safe on the server;
calling registration requires a browser with Custom Elements and Shadow DOM.

```ts
import { registerLazyAvatar } from '@lazy-avatars/web-component';
import { rack } from 'lazy-avatars/rack';
registerLazyAvatar({ collections: [rack] });
```

```html
<lazy-avatar collection="rack" seed="demo-server-01" size="32"
  title="Demo server: warning" options='{"status":"warn"}'></lazy-avatar>
```

Register once, before or after elements are connected. Duplicate tag registrations
or collection IDs throw. `tagName` optionally selects another valid custom-element
name. No collection is auto-imported or fetched. Collection code is trusted code.

Observed attributes: `collection`, `seed`, `size`, `shape`, `theme`, `palette`,
`background`, `title`, `options`. Theme accepts a core theme ID; palette accepts
JSON with five color roles or a nonempty list. Use theme or palette, never both.
Options are a JSON object of collection-specific values. Background accepts the
literal strings `true` or `false`; size is an integer 1–4096. Core limits apply.
Class and style apply to the host; its SVG lives in an open shadow root.

Changes redraw synchronously. Each shadow tree isolates its SVG IDs, including
identical repeated seeds. Title names the internal SVG; omitted title is decorative.
Invalid input clears the old SVG, sets `data-error="Invalid avatar attributes"`
and dispatches a bubbling, composed `avatar-error` event with a generic message.
Correcting attributes clears the error and restores the SVG. No seed is logged.
The executable example and browser checks live in `apps/integrations`.

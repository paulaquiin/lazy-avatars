# Custom element · lazy-avatars/web-component

Available in lazy-avatars 1.1.0, published on npm. No React needed.

```ts
import { registerLazyAvatar } from 'lazy-avatars/web-component';
import { rack } from 'lazy-avatars/rack';
registerLazyAvatar({ collections: [rack] });
```

```html
<lazy-avatar collection="rack" seed="demo-server-01" size="32"
 title="Demo server" options='{"status":"warn"}'></lazy-avatar>
```

Import is safe without DOM. Registration requires a browser; duplicate tag names
or collection IDs throw. tagName can select another valid custom-element name.
Only explicitly supplied collections are available; none is fetched automatically.
Attributes: collection, seed, size, shape, theme, palette (JSON), background (literal
true/false), title and options (JSON). Use theme or palette, not both. Core limits
and validation apply. Changes redraw synchronously in an open shadow root, isolating
IDs between repeated instances. Invalid input clears stale SVG, sets data-error
and dispatches a generic bubbling/composed avatar-error event; corrected input
recovers. Titles name the SVG, otherwise it is decorative. No request/seed logging.

Entrada sin React, registro explícito, importación segura en SSR y SVG aislado por
shadow DOM. Los atributos, errores y recuperación mantienen la API de 1.0.

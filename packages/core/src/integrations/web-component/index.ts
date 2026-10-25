import type { Collection } from '../../index.js';
import { renderInput } from '../shared/input.js';

export interface Registration {
  readonly collections: readonly Collection<object>[];
  readonly tagName?: string;
}

/** Import is SSR-safe. Call in the browser, once, with explicitly selected artwork. */
export function registerLazyAvatar({
  collections,
  tagName = 'lazy-avatar',
}: Registration): CustomElementConstructor {
  if (typeof customElements === 'undefined')
    throw new Error('registerLazyAvatar requires a browser');
  if (customElements.get(tagName)) throw new Error('Custom element already registered');
  const registry = new Map<string, Collection<object>>();
  for (const collection of collections) {
    if (registry.has(collection.id)) throw new TypeError('Duplicate collection ID');
    registry.set(collection.id, collection);
  }
  class LazyAvatar extends HTMLElement {
    static observedAttributes = [
      'collection',
      'seed',
      'size',
      'shape',
      'theme',
      'palette',
      'background',
      'title',
      'options',
    ];
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
    }
    connectedCallback(): void {
      this.render();
    }
    attributeChangedCallback(): void {
      if (this.isConnected) this.render();
    }
    private render(): void {
      const root = this.shadowRoot;
      if (!root) return;
      try {
        const collection = registry.get(this.getAttribute('collection') ?? '');
        if (!collection) throw new TypeError('Collection is not registered');
        const values = new URLSearchParams();
        for (const key of LazyAvatar.observedAttributes) {
          if (key !== 'collection' && key !== 'seed' && this.hasAttribute(key))
            values.set(key, this.getAttribute(key) ?? '');
        }
        const svg = renderInput(collection, this.getAttribute('seed') ?? '', values);
        // Only SVG produced by trusted registered collection code enters the shadow tree.
        root.innerHTML = svg;
        this.removeAttribute('data-error');
      } catch {
        root.replaceChildren();
        this.setAttribute('data-error', 'Invalid avatar attributes');
        this.dispatchEvent(
          new CustomEvent('avatar-error', {
            detail: { message: 'Invalid avatar attributes' },
            bubbles: true,
            composed: true,
          }),
        );
      }
    }
  }
  customElements.define(tagName, LazyAvatar);
  return LazyAvatar;
}

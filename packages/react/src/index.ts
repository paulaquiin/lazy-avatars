import type { AvatarOptions, Collection } from 'lazy-avatars';
import { createAvatar } from 'lazy-avatars';
import type { CSSProperties, ReactElement } from 'react';
import { createElement, useId } from 'react';

export interface AvatarProps<O extends object> extends AvatarOptions<O> {
  readonly collection: Collection<O>;
  readonly className?: string;
  readonly style?: CSSProperties;
}

/** The core owns SVG accessibility; the wrapper adds no competing role or label. */
export function Avatar<O extends object>({
  collection,
  className,
  style,
  ...options
}: AvatarProps<O>): ReactElement {
  const id = useId();
  // Reversible escaping, rather than a truncated hash, keeps React's instance identity.
  const prefix = `r-${id.replace(/[^A-Za-z0-9-]/g, (c) => `_${c.charCodeAt(0).toString(16)}_`)}`;
  const svg = createAvatar(collection, { ...options, idPrefix: options.idPrefix ?? prefix });
  return createElement('span', {
    className,
    style: { display: 'inline-flex', ...style },
    dangerouslySetInnerHTML: { __html: svg },
  });
}

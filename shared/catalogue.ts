import type { Collection } from 'lazy-avatars';
import { constellation } from 'lazy-avatars/constellation';
import { deco } from 'lazy-avatars/deco';
import { helmet } from 'lazy-avatars/helmet';
import { latte } from 'lazy-avatars/latte';
import { mission } from 'lazy-avatars/mission';
import { monogram } from 'lazy-avatars/monogram';
import { mosaic } from 'lazy-avatars/mosaic';
import { orbit } from 'lazy-avatars/orbit';
import { origami } from 'lazy-avatars/origami';
import { pantry } from 'lazy-avatars/pantry';
import { rack } from 'lazy-avatars/rack';
import { siesta } from 'lazy-avatars/siesta';
import { tinbot } from 'lazy-avatars/tinbot';

const catalogue = new Map<string, Collection<object>>(
  [
    mosaic,
    monogram,
    rack,
    siesta,
    origami,
    pantry,
    deco,
    latte,
    constellation,
    tinbot,
    orbit,
    mission,
    helmet,
  ].map((c) => [c.id, c as Collection<object>]),
);
export function getCollection(id: string): Collection<object> {
  const collection = catalogue.get(id);
  if (!collection) throw new TypeError('Unknown collection');
  return collection;
}

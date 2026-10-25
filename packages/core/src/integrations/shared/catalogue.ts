import { constellation } from '../../collections/constellation/index.js';
import { deco } from '../../collections/deco/index.js';
import { helmet } from '../../collections/helmet/index.js';
import { latte } from '../../collections/latte/index.js';
import { mission } from '../../collections/mission/index.js';
import { monogram } from '../../collections/monogram/index.js';
import { mosaic } from '../../collections/mosaic/index.js';
import { orbit } from '../../collections/orbit/index.js';
import { origami } from '../../collections/origami/index.js';
import { pantry } from '../../collections/pantry/index.js';
import { rack } from '../../collections/rack/index.js';
import { siesta } from '../../collections/siesta/index.js';
import { tinbot } from '../../collections/tinbot/index.js';
import type { Collection } from '../../index.js';

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

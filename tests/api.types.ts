import { testCollection } from '../fixtures/test-collection.js';
import { monogram } from '../packages/core/src/collections/monogram/index.js';
import { mosaic } from '../packages/core/src/collections/mosaic/index.js';
import { rack } from '../packages/core/src/collections/rack/index.js';
import { siesta } from '../packages/core/src/collections/siesta/index.js';
import { createAvatar } from '../packages/core/src/index.js';

createAvatar(mosaic, { seed: 'demo', options: { tile: 'arcs' } });
createAvatar(monogram, { seed: 'demo', options: { frame: 'shield' } });
createAvatar(rack, { seed: 'demo', options: { status: 'warn' } });
createAvatar(siesta, { seed: 'demo', options: { accessory: 'cap' } });
// @ts-expect-error status does not belong to Mosaic
createAvatar(mosaic, { seed: 'demo', options: { status: 'warn' } });
// @ts-expect-error Rack validates its enum at compile time too
createAvatar(rack, { seed: 'demo', options: { status: 'critical' } });

createAvatar(testCollection, { seed: 'demo', options: { variant: 'disc' } });
// @ts-expect-error collection-specific options must retain their enum
createAvatar(testCollection, { seed: 'demo', options: { variant: 'unknown' } });
// @ts-expect-error cannot pass options belonging to another collection
createAvatar(testCollection, { seed: 'demo', options: { animal: 'fox' } });
// @ts-expect-error seed is mandatory
createAvatar(testCollection, {});

import { constellation } from '../packages/core/src/collections/constellation/index.js';
import { deco } from '../packages/core/src/collections/deco/index.js';
import { latte } from '../packages/core/src/collections/latte/index.js';
import { origami } from '../packages/core/src/collections/origami/index.js';
import { pantry } from '../packages/core/src/collections/pantry/index.js';

createAvatar(origami, { seed: 'demo', options: { animal: 'owl' } });
createAvatar(pantry, { seed: 'demo', options: { food: 'egg' } });
createAvatar(deco, { seed: 'demo', options: { motif: 'sun' } });
createAvatar(latte, { seed: 'demo', options: { art: 'rings' } });
createAvatar(constellation, { seed: 'demo' });
// @ts-expect-error animal enum remains specific to Origami
createAvatar(origami, { seed: 'demo', options: { animal: 'dog' } });
// @ts-expect-error food enum remains specific to Pantry
createAvatar(pantry, { seed: 'demo', options: { food: 'pizza' } });
// @ts-expect-error motif enum remains specific to Deco
createAvatar(deco, { seed: 'demo', options: { motif: 'moon' } });
// @ts-expect-error art enum remains specific to Latte
createAvatar(latte, { seed: 'demo', options: { art: 'cat' } });
// @ts-expect-error options from other collections do not leak into Origami
createAvatar(origami, { seed: 'demo', options: { food: 'egg' } });

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

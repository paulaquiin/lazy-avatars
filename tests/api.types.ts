import { testCollection } from '../fixtures/test-collection.js';
import { createAvatar } from '../packages/core/src/index.js';

createAvatar(testCollection, { seed: 'demo', options: { variant: 'disc' } });
// @ts-expect-error collection-specific options must retain their enum
createAvatar(testCollection, { seed: 'demo', options: { variant: 'unknown' } });
// @ts-expect-error cannot pass options belonging to another collection
createAvatar(testCollection, { seed: 'demo', options: { animal: 'fox' } });
// @ts-expect-error seed is mandatory
createAvatar(testCollection, {});

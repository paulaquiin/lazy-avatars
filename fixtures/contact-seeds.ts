/** Invented demonstration identities; no user or production data. */
export const contactSeeds = [
  'Ada',
  'Bruno',
  'Cora',
  'Dario',
  'Elia',
  'Faye',
  'Gus',
  'Hana',
  'Ivo',
  'Juno',
  'Kai',
  'Luz',
].flatMap((first) => ['Moss', 'North', 'Oak', 'Pine', 'Quill'].map((last) => `${first} ${last}`));

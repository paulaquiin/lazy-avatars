import type { AvatarOptions, Collection, Shape, ThemeId } from 'lazy-avatars';
import { createAvatar, createAvatarDataUri, themes } from 'lazy-avatars';
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
import { contactSeeds } from '../../../fixtures/contact-seeds.js';
import './style.css';

interface Descriptor {
  collection: Collection<object>;
  fields: Readonly<Record<string, { label: string; values: readonly string[] }>>;
}
const registry: Readonly<Record<string, Descriptor>> = {
  tinbot: {
    collection: tinbot,
    fields: {
      antenna: { label: 'Antena', values: ['single', 'double', 'dome'] },
      eyes: { label: 'Ojos', values: ['gauges', 'visor', 'mixed'] },
      mouth: { label: 'Boca', values: ['grille', 'smile', 'dots'] },
    },
  },
  orbit: {
    collection: orbit,
    fields: {
      surface: { label: 'Superficie', values: ['bands', 'craters'] },
      ring: { label: 'Anillo', values: ['none', 'thin', 'wide'] },
      moon: { label: 'Luna', values: ['none', 'small'] },
    },
  },
  mission: {
    collection: mission,
    fields: {
      badge: { label: 'Insignia', values: ['shield', 'round', 'hexagon'] },
      planet: { label: 'Planeta', values: ['striped', 'ringed', 'cratered'] },
      rocket: { label: 'Cohete', values: ['upright', 'tilted'] },
    },
  },
  helmet: {
    collection: helmet,
    fields: {
      visor: { label: 'Visor', values: ['round', 'wide', 'angular'] },
      reflection: { label: 'Reflejo', values: ['ringed', 'cratered', 'crescent'] },
      antenna: { label: 'Antena', values: ['none', 'single', 'double'] },
    },
  },
  origami: {
    collection: origami,
    fields: { animal: { label: 'Animal', values: ['fox', 'cat', 'bear', 'owl'] } },
  },
  pantry: {
    collection: pantry,
    fields: { food: { label: 'Alimento', values: ['donut', 'citrus', 'egg', 'avocado'] } },
  },
  deco: {
    collection: deco,
    fields: { motif: { label: 'Motivo', values: ['fan', 'arches', 'sun'] } },
  },
  latte: {
    collection: latte,
    fields: { art: { label: 'Arte latte', values: ['heart', 'tulip', 'rosetta', 'rings'] } },
  },
  constellation: { collection: constellation, fields: {} },
  mosaic: {
    collection: mosaic,
    fields: { tile: { label: 'Tesela', values: ['arcs', 'triangles'] } },
  },
  monogram: {
    collection: monogram,
    fields: { frame: { label: 'Marco', values: ['circle', 'shield', 'diamond'] } },
  },
  rack: {
    collection: rack,
    fields: {
      status: { label: 'Estado de Rack', values: ['ok', 'warn', 'down', 'off'] },
      unit: { label: 'Unidades', values: ['disks', 'vent'] },
    },
  },
  siesta: {
    collection: siesta,
    fields: {
      accessory: { label: 'Accesorio', values: ['cap', 'zzz', 'mask', 'blanket', 'none'] },
      body: { label: 'Criatura', values: ['round', 'pear', 'cloud'] },
      mouth: { label: 'Boca', values: ['smile', 'yawn', 'sleep'] },
    },
  },
};
const labels: Readonly<Record<string, string>> = {
  single: 'Una',
  double: 'Dos',
  dome: 'Cúpula',
  gauges: 'Manómetros',
  visor: 'Visor',
  mixed: 'Desparejados',
  grille: 'Rejilla',
  dots: 'Puntos',
  bands: 'Franjas',
  craters: 'Cráteres',
  thin: 'Fino',
  wide: 'Amplio',
  small: 'Pequeña',
  hexagon: 'Hexágono',
  striped: 'Con franjas',
  ringed: 'Con anillo',
  cratered: 'Con cráteres',
  upright: 'Vertical',
  tilted: 'Inclinado',
  angular: 'Angular',
  crescent: 'Creciente',
  fox: 'Zorro',
  cat: 'Gato',
  bear: 'Oso',
  owl: 'Búho',
  donut: 'Donut',
  citrus: 'Cítrico',
  egg: 'Huevo',
  avocado: 'Aguacate',
  fan: 'Abanico',
  arches: 'Arcos escalonados',
  sun: 'Sol',
  heart: 'Corazón',
  tulip: 'Tulipán',
  rosetta: 'Roseta',
  rings: 'Anillos',
  arcs: 'Arcos',
  triangles: 'Triángulos',
  circle: 'Círculo',
  shield: 'Escudo',
  diamond: 'Rombo',
  ok: 'Operativo',
  warn: 'Advertencia',
  down: 'Caído',
  off: 'Apagado',
  disks: 'Discos',
  vent: 'Rejilla',
  cap: 'Gorro',
  zzz: 'Zzz',
  mask: 'Antifaz',
  blanket: 'Manta',
  none: 'Sin elemento',
  round: 'Redonda',
  pear: 'Pera',
  cloud: 'Nube',
  smile: 'Sonrisa',
  yawn: 'Bostezo',
  sleep: 'Dormida',
  auto: 'Propias',
  pastel: 'Pastel',
  corporate: 'Corporativo',
  night: 'Noche',
  earth: 'Tierra',
  mono: 'Monocromo',
};
const views = ['sizes', 'variety', 'context', 'palettes', 'space'];
function required<T extends HTMLElement>(selector: string): T {
  const element = document.querySelector<T>(selector);
  if (!element) throw new Error(`Missing element: ${selector}`);
  return element;
}
function node<K extends keyof HTMLElementTagNameMap>(tag: K, text?: string, className?: string) {
  const element = document.createElement(tag);
  if (text !== undefined) element.textContent = text;
  if (className) element.className = className;
  return element;
}
const controls = required<HTMLFormElement>('#controls');
const collectionSelect = required<HTMLSelectElement>('#collection');
const seedInput = required<HTMLInputElement>('#seed');
const themeSelect = required<HTMLSelectElement>('#theme');
const shapeSelect = required<HTMLSelectElement>('#shape');
const transparent = required<HTMLInputElement>('#transparent');
const dark = required<HTMLInputElement>('#dark');
const contactSheet = required<HTMLInputElement>('#contact-sheet');
const contactSize = required<HTMLSelectElement>('#contact-size');
const optionFields = required<HTMLElement>('#collection-options');
const stage = required<HTMLElement>('#sizes');
const output = required<HTMLElement>('#output');
const code = required<HTMLElement>('#code');
const status = required<HTMLElement>('#status');
const download = required<HTMLButtonElement>('#download');
const feedback = required<HTMLElement>('#copy-feedback');
let view = 'sizes';
let codeMode = 'api';
let downloadUri = '';
function descriptor(): Descriptor {
  return registry[collectionSelect.value] ?? (registry.mosaic as Descriptor);
}
function buildFields(values: URLSearchParams = new URLSearchParams()): void {
  optionFields.replaceChildren();
  for (const [key, field] of Object.entries(descriptor().fields)) {
    const label = node('label', field.label);
    label.htmlFor = `option-${key}`;
    const select = node('select');
    select.id = label.htmlFor;
    select.dataset.option = key;
    select.add(new Option(key === 'status' ? 'Auto · apagado' : 'Auto', ''));
    for (const value of field.values) select.add(new Option(labels[value] ?? value, value));
    const requested = values.get(key);
    if (requested && field.values.includes(requested)) select.value = requested;
    optionFields.append(label, select);
  }
}
function options(): AvatarOptions<object> {
  const selected: Record<string, string> = {};
  for (const select of optionFields.querySelectorAll<HTMLSelectElement>('select[data-option]'))
    if (select.value && select.dataset.option) selected[select.dataset.option] = select.value;
  return {
    seed: seedInput.value,
    shape: shapeSelect.value as Shape,
    background: !transparent.checked,
    ...(themeSelect.value === 'auto' ? {} : { palette: themeSelect.value as ThemeId }),
    ...(Object.keys(selected).length ? { options: selected } : {}),
  };
}
function image(
  seed: string,
  size: number,
  extra: Partial<AvatarOptions<object>> = {},
  collection = descriptor().collection,
): HTMLImageElement {
  const img = node('img');
  img.src = createAvatarDataUri(collection, { ...options(), seed, size, ...extra });
  img.width = size;
  img.height = size;
  img.alt = `${collection.name} · ${seed}`;
  return img;
}
function figure(
  seed: string,
  size: number,
  caption: string,
  extra: Partial<AvatarOptions<object>> = {},
): HTMLElement {
  const item = node('figure');
  item.append(image(seed, size, extra), node('figcaption', caption));
  return item;
}
function persist(): void {
  const params = new URLSearchParams({
    collection: collectionSelect.value,
    seed: seedInput.value,
    theme: themeSelect.value,
    shape: shapeSelect.value,
    view,
  });
  if (transparent.checked) params.set('background', '0');
  if (dark.checked) params.set('dark', '1');
  if (contactSheet.checked) params.set('count', '60');
  params.set('contactSize', contactSize.value);
  for (const [key, value] of Object.entries(options().options ?? {}))
    params.set(key, String(value));
  history.replaceState(null, '', `${location.pathname}?${params}${location.hash}`);
}
function load(): void {
  const params = new URLSearchParams(location.search);
  const requested = params.get('collection') ?? 'mosaic';
  collectionSelect.value = Object.hasOwn(registry, requested) ? requested : 'mosaic';
  seedInput.value = params.get('seed') ?? 'Ada Moss';
  const theme = params.get('theme') ?? 'auto';
  themeSelect.value = theme === 'auto' || Object.hasOwn(themes, theme) ? theme : 'auto';
  const shape = params.get('shape') ?? 'rounded';
  shapeSelect.value = ['square', 'rounded', 'circle'].includes(shape) ? shape : 'rounded';
  view = views.includes(params.get('view') ?? '') ? (params.get('view') ?? 'sizes') : 'sizes';
  transparent.checked = params.get('background') === '0';
  dark.checked = params.get('dark') === '1';
  contactSheet.checked = params.get('count') === '60';
  contactSize.value = ['24', '32', '64', '128'].includes(params.get('contactSize') ?? '')
    ? (params.get('contactSize') ?? '64')
    : '64';
  buildFields(params);
}
function contextView(): HTMLElement[] {
  const members = node('article', undefined, 'context-card');
  members.append(node('h3', 'Equipo de ejemplo'));
  for (const seed of contactSeeds.slice(0, 3)) {
    const row = node('div', undefined, 'member');
    row.append(image(seed, 32), node('span', seed));
    members.append(row);
  }
  const comment = node('article', undefined, 'context-card');
  comment.append(node('h3', 'Conversación'));
  const message = node('div', undefined, 'member');
  message.append(
    image('Cora Oak', 40),
    node('p', 'Cora Oak · Todo listo para la próxima entrega.'),
  );
  comment.append(message);
  const stack = node('div', undefined, 'avatar-stack');
  for (const seed of contactSeeds.slice(0, 5)) stack.append(image(seed, 28));
  comment.append(stack);
  const profile = node('article', undefined, 'context-card profile');
  profile.append(
    image(seedInput.value, 72),
    node('h3', seedInput.value),
    node('p', 'Perfil de demostración'),
  );
  const servers = node('article', undefined, 'context-card servers');
  servers.append(node('h3', 'Servidores · estados ficticios'));
  const table = node('table');
  const body = node('tbody');
  for (const [index, state] of ['ok', 'warn', 'down', 'off'].entries()) {
    const row = node('tr');
    const avatar = node('td');
    avatar.append(
      image(
        `demo-host-${index + 1}`,
        24,
        collectionSelect.value === 'rack'
          ? { options: { ...(options().options ?? {}), status: state } }
          : {},
      ),
    );
    const stateCell = node('td', labels[state] ?? state);
    stateCell.dataset.status = state;
    row.append(avatar, node('td', `demo-host-${index + 1}`), stateCell);
    body.append(row);
  }
  table.append(body);
  servers.append(table);
  return [members, comment, profile, servers];
}
function spaceView(): HTMLElement[] {
  const family: readonly [Collection<object>, string][] = [
    [constellation, 'Trazos y estrellas'],
    [orbit, 'Planeta con volumen'],
    [mission, 'Insignia con iniciales'],
    [helmet, 'Personaje astronauta'],
  ];
  return family.map(([collection, description]) => {
    const card = node('article', undefined, 'context-card space-card');
    const button = node('button', collection.name);
    button.type = 'button';
    button.dataset.spaceCollection = collection.id;
    button.addEventListener('click', () => {
      collectionSelect.value = collection.id;
      view = 'sizes';
      buildFields();
      render();
    });
    const examples = node('div', undefined, 'space-examples');
    for (const size of [32, 64, 128])
      examples.append(image(seedInput.value, size, { options: {} }, collection));
    card.append(button, node('p', description), examples);
    return card;
  });
}
function render(updateUrl = true): void {
  document.documentElement.dataset.theme = dark.checked ? 'dark' : 'light';
  stage.className = `stage ${view}`;
  required<HTMLElement>('#review-controls').hidden = view !== 'variety';
  for (const button of document.querySelectorAll<HTMLButtonElement>('button[data-view]'))
    button.setAttribute('aria-pressed', String(button.dataset.view === view));
  for (const button of document.querySelectorAll<HTMLButtonElement>('button[data-collection]'))
    button.setAttribute(
      'aria-pressed',
      String(button.dataset.collection === collectionSelect.value),
    );
  try {
    const current = options();
    const collection = descriptor().collection;
    const svg = createAvatar(collection, current);
    if (view === 'sizes')
      stage.replaceChildren(
        ...[24, 32, 48, 64, 128].map((size) => figure(current.seed, size, `${size} px`)),
      );
    else if (view === 'variety') {
      stage.style.setProperty('--contact-size', `${contactSize.value}px`);
      stage.replaceChildren(
        ...contactSeeds
          .slice(0, contactSheet.checked ? 60 : 12)
          .map((seed) => figure(seed, Number(contactSize.value), seed)),
      );
    } else if (view === 'palettes')
      stage.replaceChildren(
        figure(current.seed, 80, 'Propias', { palette: collection.palettes }),
        ...Object.keys(themes).map((palette) =>
          figure(current.seed, 80, labels[palette] ?? palette, { palette: palette as ThemeId }),
        ),
      );
    else if (view === 'space') stage.replaceChildren(...spaceView());
    else stage.replaceChildren(...contextView());
    output.textContent = svg;
    code.textContent =
      codeMode === 'api'
        ? `import { createAvatar } from 'lazy-avatars';\nimport { ${collection.id} } from 'lazy-avatars/${collection.id}';\n\nconst svg = createAvatar(${collection.id}, ${JSON.stringify(current, null, 2)});`
        : `import { createAvatarDataUri } from 'lazy-avatars';\nimport { ${collection.id} } from 'lazy-avatars/${collection.id}';\n\nconst img = document.createElement('img');\nimg.src = createAvatarDataUri(${collection.id}, ${JSON.stringify(current, null, 2)});\nimg.alt = ${JSON.stringify(`Avatar · ${current.seed}`)};\ndocument.body.append(img);`;
    status.textContent = `${new TextEncoder().encode(svg).length} bytes · ${collection.name}${collection.id === 'rack' ? ` · estado representado: ${labels[String(current.options && 'status' in current.options ? current.options.status : 'off')] ?? 'Apagado'}` : ''}`;
    downloadUri = createAvatarDataUri(collection, current);
    download.disabled = false;
    if (updateUrl) persist();
  } catch (error) {
    stage.replaceChildren();
    output.textContent = '';
    code.textContent = '';
    downloadUri = '';
    download.disabled = true;
    status.textContent = error instanceof Error ? error.message : 'No se pudo generar el avatar';
    if (updateUrl) persist();
  }
}
for (const [id, entry] of Object.entries(registry)) {
  const card = node('button', undefined, 'collection-card');
  card.type = 'button';
  card.dataset.collection = id;
  card.setAttribute('aria-pressed', 'false');
  const img = node('img');
  img.src = createAvatarDataUri(entry.collection, { seed: 'Ada Moss', size: 48 });
  img.width = 48;
  img.height = 48;
  img.alt = '';
  card.append(img, node('span', entry.collection.name));
  card.addEventListener('click', () => {
    collectionSelect.value = id;
    buildFields();
    render();
  });
  required<HTMLElement>('#collection-cards').append(card);
}
controls.addEventListener('input', (event) => {
  if (event.target === collectionSelect) buildFields();
  render();
});
controls.addEventListener('submit', (event) => event.preventDefault());
for (const button of document.querySelectorAll<HTMLButtonElement>('button[data-view]'))
  button.addEventListener('click', () => {
    view = button.dataset.view ?? 'sizes';
    render();
  });
for (const button of document.querySelectorAll<HTMLButtonElement>('button[data-code]'))
  button.addEventListener('click', () => {
    codeMode = button.dataset.code ?? 'api';
    for (const other of document.querySelectorAll('button[data-code]'))
      other.setAttribute('aria-pressed', String(other === button));
    render();
  });
contactSheet.addEventListener('input', () => render());
contactSize.addEventListener('input', () => render());
download.addEventListener('click', () => {
  if (!downloadUri) return;
  const link = node('a');
  link.href = downloadUri;
  link.download = `lazy-avatar-${collectionSelect.value}.svg`;
  link.click();
});
async function copy(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
    feedback.textContent = 'Copiado.';
  } catch {
    feedback.textContent =
      'No se pudo acceder al portapapeles. Puedes seleccionar y copiar el texto.';
  }
}
required<HTMLButtonElement>('#copy-code').addEventListener('click', () => {
  void copy(code.textContent ?? '');
});
required<HTMLButtonElement>('#share').addEventListener('click', () => {
  void copy(location.href);
});
window.addEventListener('popstate', () => {
  load();
  render(false);
});
load();
render();

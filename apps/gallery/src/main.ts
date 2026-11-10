import type { AvatarOptions, Collection, Palette, Shape, ThemeId } from 'lazy-avatars';
import {
  contrastRatio,
  createAvatar,
  createAvatarDataUri,
  normalizeColor,
  themes,
} from 'lazy-avatars';
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
import './landing.css';

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
      status: { label: 'Estado del servidor', values: ['ok', 'warn', 'down', 'off'] },
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
  auto: 'De la colección',
  pastel: 'Pastel',
  corporate: 'Corporativo',
  night: 'Noche',
  earth: 'Tierra',
  mono: 'Monocromo',
};
const views = ['sizes', 'variety', 'context', 'palettes'];
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
const seedPreset = required<HTMLSelectElement>('#seed-preset');
const seedInput = required<HTMLInputElement>('#seed');
const seedCustomLabel = required<HTMLLabelElement>('#seed-custom-label');
const themeSelect = required<HTMLSelectElement>('#theme');
const shapeSelect = required<HTMLSelectElement>('#shape');
const transparent = required<HTMLInputElement>('#transparent');
const dark = required<HTMLInputElement>('#dark');
const contactSize = required<HTMLSelectElement>('#contact-size');
const optionFields = required<HTMLElement>('#collection-options');
const stage = required<HTMLElement>('#sizes');
const output = required<HTMLElement>('#output');
const code = required<HTMLElement>('#code');
const status = required<HTMLElement>('#status');
const share = required<HTMLButtonElement>('#share');
const feedback = required<HTMLElement>('#copy-feedback');
const customPalette = required<HTMLInputElement>('#custom-palette');
const paletteFields = required<HTMLElement>('#palette-fields');
const paletteHint = required<HTMLElement>('#palette-hint');
const roles = ['background', 'primary', 'secondary', 'accent', 'ink'] as const;
const colorLabels: Record<(typeof roles)[number], string> = {
  background: 'Fondo',
  primary: 'Principal',
  secondary: 'Secundario',
  accent: 'Acento',
  ink: 'Tinta',
};
const colorFields = Object.fromEntries(
  roles.map((role) => [role, required<HTMLInputElement>(`#color-${role}`)]),
) as Record<(typeof roles)[number], HTMLInputElement>;
function paletteValue(): Palette {
  return Object.fromEntries(
    roles.map((role) => [role, colorFields[role].value]),
  ) as unknown as Palette;
}
let view = 'sizes';
let reviewCount: 12 | 60 = 12;
let codeMode = 'api';
function showCustomSeed(show: boolean): void {
  seedCustomLabel.hidden = !show;
  seedInput.hidden = !show;
  seedInput.required = show;
}
function setSeed(seed: string): void {
  seedInput.value = seed;
  const example = Array.from(seedPreset.options).find(
    (option) => option.value === seed && option.value !== '__custom',
  );
  seedPreset.value = example ? seed : '__custom';
  showCustomSeed(!example);
}
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
    select.add(new Option(key === 'status' ? 'Por defecto (apagado)' : 'Por defecto', ''));
    for (const value of field.values) select.add(new Option(labels[value] ?? value, value));
    const requested = values.get(key);
    if (requested && field.values.includes(requested)) select.value = requested;
    const group = node('div', undefined, 'control-field');
    group.append(label, select);
    optionFields.append(group);
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
    ...(customPalette.checked
      ? { palette: paletteValue() }
      : themeSelect.value === 'auto'
        ? {}
        : { palette: themeSelect.value as ThemeId }),
    ...(Object.keys(selected).length ? { options: selected } : {}),
  };
}
function image(
  seed: string,
  size: number,
  extra: Partial<AvatarOptions<object>> = {},
): HTMLImageElement {
  const img = node('img');
  const collection = descriptor().collection;
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
  const params = new URLSearchParams();
  if (collectionSelect.value !== 'mosaic') params.set('collection', collectionSelect.value);
  if (seedInput.value !== 'Ada Moss') params.set('seed', seedInput.value);
  if (themeSelect.value !== 'auto') params.set('theme', themeSelect.value);
  if (shapeSelect.value !== 'rounded') params.set('shape', shapeSelect.value);
  if (view !== 'sizes') params.set('view', view);
  if (customPalette.checked) {
    params.set('custom', '1');
    for (const role of roles) params.set(`color-${role}`, colorFields[role].value);
  }
  if (transparent.checked) params.set('background', '0');
  if (dark.checked) params.set('dark', '1');
  if (reviewCount === 60) params.set('count', '60');
  if (contactSize.value !== '64') params.set('contactSize', contactSize.value);
  for (const [key, value] of Object.entries(options().options ?? {}))
    params.set(key, String(value));
  const query = params.toString();
  history.replaceState(null, '', `${location.pathname}${query ? `?${query}` : ''}`);
}
function load(): void {
  const params = new URLSearchParams(location.search);
  const requested = params.get('collection') ?? 'mosaic';
  collectionSelect.value = Object.hasOwn(registry, requested) ? requested : 'mosaic';
  setSeed(params.get('seed') ?? 'Ada Moss');
  const theme = params.get('theme') ?? 'auto';
  themeSelect.value = theme === 'auto' || Object.hasOwn(themes, theme) ? theme : 'auto';
  const shape = params.get('shape') ?? 'rounded';
  shapeSelect.value = ['square', 'rounded', 'circle'].includes(shape) ? shape : 'rounded';
  view = views.includes(params.get('view') ?? '') ? (params.get('view') ?? 'sizes') : 'sizes';
  transparent.checked = params.get('background') === '0';
  dark.checked = params.get('dark') === '1';
  reviewCount = params.get('count') === '60' ? 60 : 12;
  contactSize.value = ['24', '32', '64', '128'].includes(params.get('contactSize') ?? '')
    ? (params.get('contactSize') ?? '64')
    : '64';
  customPalette.checked = params.get('custom') === '1';
  for (const role of roles)
    if (params.has(`color-${role}`)) colorFields[role].value = params.get(`color-${role}`) ?? '';
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
  themeSelect.disabled = customPalette.checked;
  paletteFields.hidden = !customPalette.checked;
  paletteHint.hidden = !customPalette.checked;
  for (const role of roles) colorFields[role].disabled = !customPalette.checked;
  try {
    const current = options();
    const collection = descriptor().collection;
    const svg = createAvatar(collection, current);
    const preview = required<HTMLElement>('#palette-preview');
    const contrast = required<HTMLElement>('#palette-contrast');
    preview.replaceChildren();
    contrast.textContent = '';
    if (customPalette.checked) {
      const p = paletteValue();
      for (const role of roles) {
        const swatch = node('span', colorLabels[role]);
        swatch.style.backgroundColor = normalizeColor(p[role]);
        swatch.style.color =
          contrastRatio(p[role], '#000') >= contrastRatio(p[role], '#fff') ? '#000' : '#fff';
        preview.append(swatch);
      }
      contrast.textContent =
        ['primary', 'secondary', 'accent', 'ink']
          .map(
            (role) =>
              `${colorLabels[role as keyof typeof colorLabels]} sobre fondo: ${contrastRatio(p[role as keyof Palette], p.background).toFixed(2)}:1`,
          )
          .join(' · ') +
        '. Referencia visual; no certifica accesibilidad. Revisa también el fondo real si usas transparencia.';
    }
    if (view === 'sizes')
      stage.replaceChildren(
        ...[24, 32, 48, 64, 128].map((size) => figure(current.seed, size, `${size} px`)),
      );
    else if (view === 'variety') {
      stage.style.setProperty('--contact-size', `${contactSize.value}px`);
      stage.replaceChildren(
        ...contactSeeds
          .slice(0, reviewCount)
          .map((seed) => figure(seed, Number(contactSize.value), seed)),
      );
    } else if (view === 'palettes')
      stage.replaceChildren(
        ...(customPalette.checked
          ? [figure(current.seed, 80, 'Personalizada', { palette: paletteValue() })]
          : []),
        figure(current.seed, 80, 'De la colección', { palette: collection.palettes }),
        ...Object.keys(themes).map((palette) =>
          figure(current.seed, 80, labels[palette] ?? palette, { palette: palette as ThemeId }),
        ),
      );
    else stage.replaceChildren(...contextView());
    output.textContent = svg;
    code.textContent =
      codeMode === 'react'
        ? `import { Avatar } from 'lazy-avatars/react';\nimport { ${collection.id} } from 'lazy-avatars/${collection.id}';\n\n// npm install lazy-avatars@1.1.0 react@19\n<Avatar collection={${collection.id}} {...${JSON.stringify({ ...current, title: `Avatar · ${current.seed}` }, null, 2)}} />`
        : codeMode === 'api'
          ? `import { createAvatar } from 'lazy-avatars';\nimport { ${collection.id} } from 'lazy-avatars/${collection.id}';\n\nconst svg = createAvatar(${collection.id}, ${JSON.stringify(current, null, 2)});`
          : `import { createAvatarDataUri } from 'lazy-avatars';\nimport { ${collection.id} } from 'lazy-avatars/${collection.id}';\n\nconst img = document.createElement('img');\nimg.src = createAvatarDataUri(${collection.id}, ${JSON.stringify(current, null, 2)});\nimg.alt = ${JSON.stringify(`Avatar · ${current.seed}`)};\ndocument.body.append(img);`;
    status.textContent = '';
    share.disabled = false;
    share.textContent = 'Copiar enlace';
    if (updateUrl) persist();
  } catch (error) {
    required<HTMLElement>('#palette-preview').replaceChildren();
    required<HTMLElement>('#palette-contrast').textContent = '';
    stage.replaceChildren();
    output.textContent = '';
    code.textContent = '';
    share.disabled = true;
    status.textContent =
      error instanceof Error && error.message.startsWith('seed must contain')
        ? 'Escribe un nombre o texto para crear el avatar.'
        : error instanceof Error && error.message.startsWith('Colors must be')
          ? 'Revisa los colores: usa #RGB o #RRGGBB.'
          : 'No se pudo generar el avatar. Revisa los ajustes e inténtalo de nuevo.';
    if (updateUrl) persist();
  }
}
const invitationMascot = required<HTMLImageElement>('#invitation-mascot');
const heroMascot = required<HTMLImageElement>('#hero-mascot');
const playground = required<HTMLElement>('#playground');
const arrival = required<HTMLElement>('#playground-arrival');
const awakeMascotUrl = new URL('../../../assets/previews/siesta-awake.svg', import.meta.url).href;
const awakeBrandUrl = new URL('../../../assets/brand/siesta-mark-awake.svg', import.meta.url).href;
let mascotIsTraveling = false;

async function travelToGenerator(source: HTMLImageElement, awakeUrl: string) {
  if (mascotIsTraveling) return;
  mascotIsTraveling = true;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const previousScrollBehavior = document.documentElement.style.scrollBehavior;
  document.documentElement.style.scrollBehavior = 'auto';
  let traveler: HTMLImageElement | undefined;
  try {
    if (!reducedMotion) {
      const start = source.getBoundingClientRect();
      traveler = source.cloneNode(true) as HTMLImageElement;
      traveler.removeAttribute('id');
      traveler.className = 'traveling-mascot is-waking';
      traveler.alt = '';
      traveler.setAttribute('aria-hidden', 'true');
      Object.assign(traveler.style, {
        left: `${start.left}px`,
        top: `${start.top}px`,
        width: `${start.width}px`,
        height: `${start.height}px`,
      });
      document.body.append(traveler);
      source.style.visibility = 'hidden';
      await new Promise((resolve) => window.setTimeout(resolve, 260));
      traveler.src = awakeUrl;
      await new Promise((resolve) => window.setTimeout(resolve, 180));
      traveler.classList.remove('is-waking');
    }

    arrival.classList.add('is-active');
    arrival.replaceChildren();
    if (traveler) {
      const flyingMascot = traveler;
      const start = source.getBoundingClientRect();
      const destination = arrival.getBoundingClientRect();
      const scrollStart = window.scrollY;
      const scrollEnd = Math.max(
        0,
        Math.min(
          document.documentElement.scrollHeight - window.innerHeight,
          scrollStart + playground.getBoundingClientRect().top - 80,
        ),
      );
      const endTop = destination.top - (scrollEnd - scrollStart);
      const duration = Math.min(1800, Math.max(950, Math.abs(scrollEnd - scrollStart) * 0.8));
      const started = performance.now();

      await new Promise<void>((resolve) => {
        function frame(now: number) {
          const t = Math.min(1, (now - started) / duration);
          const progress = t * t * (3 - 2 * t);
          window.scrollTo(0, scrollStart + (scrollEnd - scrollStart) * progress);
          flyingMascot.style.left = `${start.left + (destination.left - start.left) * progress}px`;
          flyingMascot.style.top = `${start.top + (endTop - start.top) * progress + Math.sin(Math.PI * progress) * 84}px`;
          flyingMascot.style.width = `${start.width + (destination.width - start.width) * progress}px`;
          flyingMascot.style.height = `${start.height + (destination.height - start.height) * progress}px`;
          flyingMascot.style.transform = `rotate(${8 - 26 * Math.sin(Math.PI * progress) - 8 * progress}deg)`;
          if (t < 1) requestAnimationFrame(frame);
          else resolve();
        }
        requestAnimationFrame(frame);
      });
    } else {
      playground.scrollIntoView({ block: 'start', behavior: 'auto' });
    }

    const awake = new Image();
    awake.src = awakeUrl;
    awake.alt = '';
    arrival.replaceChildren(awake);
    (seedInput.hidden ? seedPreset : seedInput).focus({ preventScroll: true });
  } finally {
    traveler?.remove();
    source.style.visibility = '';
    document.documentElement.style.scrollBehavior = previousScrollBehavior;
    mascotIsTraveling = false;
  }
}

required<HTMLButtonElement>('#invitation-cta').addEventListener('click', () => {
  void travelToGenerator(invitationMascot, awakeMascotUrl);
});
required<HTMLAnchorElement>('#hero-cta').addEventListener('click', (event) => {
  event.preventDefault();
  void travelToGenerator(heroMascot, awakeBrandUrl);
});

for (const [id, entry] of Object.entries(registry)) {
  const card = node('button', undefined, 'collection-card');
  card.type = 'button';
  card.dataset.collection = id;
  card.setAttribute('aria-pressed', 'false');
  const previews = node('span', undefined, 'collection-previews');
  for (const seed of ['Ada Moss', 'Mara Sol', 'Nico Nube']) {
    const img = node('img');
    img.src = createAvatarDataUri(entry.collection, { seed, size: 96 });
    img.width = 96;
    img.height = 96;
    img.alt = '';
    previews.append(img);
  }
  card.append(previews, node('span', entry.collection.name, 'collection-name'));
  card.addEventListener('click', () => {
    collectionSelect.value = id;
    buildFields();
    render();
    required<HTMLElement>('#playground').scrollIntoView({ block: 'start' });
    collectionSelect.focus({ preventScroll: true });
  });
  required<HTMLElement>('#collection-cards').insertBefore(
    card,
    required<HTMLElement>('#catalogue-invitation'),
  );
}
controls.addEventListener('input', (event) => {
  if (event.target === collectionSelect) buildFields();
  if (event.target === seedPreset) {
    if (seedPreset.value === '__custom') {
      showCustomSeed(true);
      seedInput.focus();
      seedInput.select();
    } else {
      seedInput.value = seedPreset.value;
      showCustomSeed(false);
    }
  }
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
contactSize.addEventListener('input', () => render());
async function copy(text: string, target: HTMLElement, success: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
    target.textContent = success;
  } catch {
    target.textContent =
      'No se pudo acceder al portapapeles. Puedes seleccionar y copiar el texto.';
  }
}
required<HTMLButtonElement>('#copy-install').addEventListener('click', () => {
  void copy('npm i lazy-avatars', required<HTMLElement>('#install-feedback'), 'Comando copiado.');
});
required<HTMLButtonElement>('#shuffle-seed').addEventListener('click', () => {
  let index = Math.floor(Math.random() * contactSeeds.length);
  if (contactSeeds[index] === seedInput.value) index = (index + 1) % contactSeeds.length;
  setSeed(contactSeeds[index] ?? 'Ada Moss');
  render();
});
required<HTMLButtonElement>('#copy-code').addEventListener('click', () => {
  void copy(code.textContent ?? '', feedback, 'Código copiado.');
});
share.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(`${location.origin}${location.pathname}${location.search}`);
    share.textContent = 'Enlace copiado';
    window.setTimeout(() => {
      if (share.textContent === 'Enlace copiado') share.textContent = 'Copiar enlace';
    }, 1800);
  } catch {
    status.textContent = 'No se pudo copiar el enlace. Cópialo desde la barra de direcciones.';
  }
});
window.addEventListener('popstate', () => {
  load();
  render(false);
});
load();
render();

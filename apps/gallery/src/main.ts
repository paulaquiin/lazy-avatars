import type { Shape, ThemeId } from 'lazy-avatars';
import { createAvatar, createAvatarDataUri } from 'lazy-avatars';
import { testCollection } from '../../../fixtures/test-collection.js';
import './style.css';

function required<T extends HTMLElement>(selector: string): T {
  const element = document.querySelector<T>(selector);
  if (!element) throw new Error(`Missing element: ${selector}`);
  return element;
}

const controls = required<HTMLFormElement>('#controls');
const seed = required<HTMLInputElement>('#seed');
const theme = required<HTMLSelectElement>('#theme');
const shape = required<HTMLSelectElement>('#shape');
const sizes = required<HTMLElement>('#sizes');
const output = required<HTMLElement>('#output');
const status = required<HTMLParagraphElement>('#status');
const download = required<HTMLButtonElement>('#download');
let downloadUri = '';

function render(): void {
  try {
    const options = {
      seed: seed.value,
      palette: theme.value as ThemeId,
      shape: shape.value as Shape,
    };
    const svg = createAvatar(testCollection, options);
    const previews = [24, 32, 48, 64, 128].map((size) => {
      const figure = document.createElement('figure');
      const image = document.createElement('img');
      image.src = createAvatarDataUri(testCollection, { ...options, size });
      image.width = size;
      image.height = size;
      image.alt = `Avatar de prueba a ${size} píxeles`;
      const caption = document.createElement('figcaption');
      caption.textContent = `${size} px`;
      figure.append(image, caption);
      return figure;
    });
    sizes.replaceChildren(...previews);
    output.textContent = svg;
    const bytes = new TextEncoder().encode(svg).length;
    status.textContent = `${bytes} bytes · misma semilla y opciones, mismos bytes`;
    downloadUri = createAvatarDataUri(testCollection, options);
    download.disabled = false;
  } catch (error) {
    sizes.replaceChildren();
    output.textContent = '';
    downloadUri = '';
    download.disabled = true;
    status.textContent = error instanceof Error ? error.message : 'No se pudo generar el avatar';
  }
}

controls.addEventListener('input', render);
controls.addEventListener('change', render);
controls.addEventListener('submit', (event) => event.preventDefault());
download.addEventListener('click', () => {
  if (!downloadUri) return;
  const link = document.createElement('a');
  link.href = downloadUri;
  link.download = 'lazy-avatar.svg';
  link.click();
});
render();

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import type { Plugin } from 'vite';

const site = 'https://paulaquiin.github.io/lazy-avatars/';
const repo = 'https://github.com/paulaquiin/lazy-avatars';
const version = JSON.parse(
  readFileSync(new URL('../../packages/core/package.json', import.meta.url), 'utf8'),
).version as string;

const collections = [
  [
    'mosaic',
    'Mosaico',
    'Geometric mosaic avatars',
    'Arcs and triangular tiles form a geometric identicon for profiles and teams.',
    'Use it for abstract identities in member lists and comments.',
    "{ tile: 'arcs' }",
  ],
  [
    'monogram',
    'Monograma',
    'Monogram and initials avatars',
    'Original serif letter paths place initials inside circle, shield or diamond frames.',
    'Use it when initials should remain recognizable without loading a font.',
    "{ frame: 'shield' }",
  ],
  [
    'rack',
    'Rack',
    'Server rack SVG avatars',
    'Server-inspired avatars combine original pixel initials, disk or vent units and status LEDs.',
    'Use it for infrastructure dashboards. Status is supplied by your app, defaults to off and must also have a text label; this avatar does not monitor a server.',
    "{ status: 'warn', unit: 'disks' }",
  ],
  [
    'siesta',
    'Siesta',
    'Sleepy character avatars',
    'Round, pear and cloud characters have sleepy expressions, with caps, masks or blankets.',
    'Use these friendly characters for community profiles, teammates or bots.',
    "{ accessory: 'zzz', body: 'round', mouth: 'yawn' }",
  ],
  [
    'origami',
    'Origami',
    'Origami animal avatars',
    'Folded geometric shapes create fox, cat, bear and owl avatars.',
    'Use it for teams and profiles that need a recognizable animal silhouette.',
    "{ animal: 'fox' }",
  ],
  [
    'pantry',
    'Despensa',
    'Food SVG avatars',
    'Donut, citrus, egg and avocado illustrations give each profile a food-themed identity.',
    'Use it for food communities, member lists and playful account placeholders.',
    "{ food: 'avocado' }",
  ],
  [
    'deco',
    'Déco',
    'Art Deco geometric avatars',
    'Fan, arch and sun motifs create compact Art Deco-inspired identity marks.',
    'Use it when a profile needs an ornamental geometric badge instead of a face.',
    "{ motif: 'fan' }",
  ],
  [
    'latte',
    'Latte',
    'Coffee and latte art avatars',
    'Coffee cups contain heart, tulip, rosetta or ring patterns selected by a seed.',
    'Use it for café projects, relaxed communities and coffee-themed bots.',
    "{ art: 'tulip' }",
  ],
  [
    'constellation',
    'Constelación',
    'Constellation identicon avatars',
    'A seed creates a small star map with connected points and a contrasting sky.',
    'Use it for abstract space-themed profiles. This collection has no collection-specific options.',
    '{}',
  ],
  [
    'tinbot',
    'Hojalata',
    'Robot SVG avatars',
    'Mechanical robot faces combine antennas, gauges or visors, and grille, smile or dot mouths.',
    'Use it to identify bots, automation accounts and technical teammates.',
    "{ antenna: 'double', eyes: 'visor', mouth: 'smile' }",
  ],
  [
    'orbit',
    'Órbita',
    'Planet and orbit avatars',
    'Banded or cratered planets can have thin or wide rings and a small moon.',
    'Use it for space-themed teams or profiles where a planet silhouette works best.',
    "{ surface: 'bands', ring: 'wide', moon: 'small' }",
  ],
  [
    'mission',
    'Misión',
    'Space mission badge avatars',
    'Mission patches combine original sans initials, rockets and striped, ringed or cratered planets.',
    'Use it for team badges, project identities and space-themed communities.',
    "{ badge: 'shield', planet: 'ringed', rocket: 'tilted' }",
  ],
  [
    'helmet',
    'Casco',
    'Astronaut helmet avatars',
    'Astronaut helmets have round, wide or angular visors with planet or crescent reflections.',
    'Use it for individual profiles and explorers in a space-themed interface.',
    "{ visor: 'wide', reflection: 'crescent', antenna: 'single' }",
  ],
] as const;

const escapeHtml = (text: string) =>
  text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');

function metadata(title: string, description: string, path = '') {
  const url = site + path;
  return `<meta name="description" content="${escapeHtml(description)}">
<link rel="canonical" href="${url}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="lazy-avatars">
<meta property="og:title" content="${escapeHtml(title)}">
<meta property="og:description" content="${escapeHtml(description)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${site}social-preview.png">
<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
<meta property="og:image:alt" content="lazy-avatars: previews of thirteen original SVG avatar collections">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escapeHtml(title)}">
<meta name="twitter:description" content="${escapeHtml(description)}">
<meta name="twitter:image" content="${site}social-preview.png">
<meta name="twitter:image:alt" content="Thirteen original lazy-avatars collections">
<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'SoftwareSourceCode',
    name: 'lazy-avatars',
    description,
    url,
    codeRepository: repo,
    license: `${repo}/blob/main/LICENSE`,
    programmingLanguage: ['TypeScript', 'JavaScript'],
    runtimePlatform: 'Browser and Node.js',
    softwareVersion: version,
  }).replaceAll('<', '\\u003c')}</script>`;
}

const links = (prefix = '') =>
  collections
    .map(([id, name]) => `<li><a href="${prefix}collections/${id}/">${name} / ${id}</a></li>`)
    .join('');

function page(title: string, description: string, path: string, body: string) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)}</title>${metadata(title, description, path)}
<style>body{font:17px/1.65 system-ui,sans-serif;background:#f6f3ec;color:#243b35;margin:0}main{max-width:960px;padding:32px 24px;margin:auto}a{color:#315647;text-underline-offset:3px}nav{display:flex;gap:20px;flex-wrap:wrap}h1{font-size:clamp(30px,5vw,48px);line-height:1.15}h2{margin-top:32px}pre{overflow:auto;padding:20px;background:#fffdf8;border:1px solid #cbd5c6;border-radius:12px}img{max-width:100%}table{border-collapse:collapse;font-size:15px}th,td{border:1px solid #cbd5c6;padding:12px;text-align:left;vertical-align:top}.table-scroll{overflow:auto}ul{padding-left:24px}footer{margin-top:40px;border-top:1px solid #cbd5c6;padding-top:16px}.preview{display:flex;gap:20px;flex-wrap:wrap}</style>
</head><body><main><nav aria-label="Main navigation"><a href="${site}">Gallery / Galería</a><a href="${site}comparison/">Compare libraries</a><a href="https://www.npmjs.com/package/lazy-avatars">npm</a><a href="${repo}">GitHub</a></nav>${body}<footer>Maintained by <a href="${repo}">the lazy-avatars project</a>. Original artwork and code: <a href="${repo}/blob/main/LICENSE">MIT</a>. No hosted public image API.</footer></main></body></html>`;
}

function comparisonBody() {
  const source = readFileSync(new URL('../../docs/comparison.md', import.meta.url), 'utf8');
  // This build-only renderer accepts our small, reviewed Markdown document, not user input.
  const inline = (text: string) =>
    escapeHtml(text)
      .replace(/\[([^\]]+)\]\((https:\/\/[^)]+)\)/g, '<a href="$2">$1</a>')
      .replace(/`([^`]+)`/g, '<code>$1</code>');
  return source
    .trim()
    .split(/\n\s*\n/)
    .map((block) => {
      if (block.startsWith('# ')) return `<h1>${inline(block.slice(2))}</h1>`;
      if (block.startsWith('## ')) return `<h2>${inline(block.slice(3))}</h2>`;
      if (block.startsWith('|')) {
        const rows = block
          .split('\n')
          .filter((_, i) => i !== 1)
          .map(
            (line, i) =>
              `<tr>${line
                .slice(1, -1)
                .split('|')
                .map((cell) => `<${i ? 'td' : 'th'}>${inline(cell.trim())}</${i ? 'td' : 'th'}>`)
                .join('')}</tr>`,
          )
          .join('');
        return `<div class="table-scroll"><table>${rows}</table></div>`;
      }
      if (block.startsWith('- '))
        return `<ul>${block
          .split('\n')
          .map((line) => `<li>${inline(line.slice(2))}</li>`)
          .join('')}</ul>`;
      return `<p>${inline(block.replaceAll('\n', ' '))}</p>`;
    })
    .join('\n');
}

export function discoveryPages(): Plugin {
  return {
    name: 'lazy-avatars-static-discovery',
    transformIndexHtml: {
      order: 'post',
      handler(html) {
        const title = 'lazy-avatars · Librería de avatares SVG para JavaScript y React';
        const description =
          'Librería de avatares SVG deterministas: 13 colecciones originales para perfiles, equipos, servidores y bots. Núcleo sin dependencias, React opcional y arte MIT.';
        const content = `<section class="discovery" aria-labelledby="about-library"><div class="discovery-grid"><div><h2 id="about-library">Carácter por fuera.<br />Sencillez por dentro.</h2>
<p>lazy-avatars es una librería de avatares SVG deterministas para JavaScript y TypeScript. Trece colecciones originales para perfiles, equipos, servidores y bots. El núcleo no tiene dependencias de ejecución; React es opcional.</p>
<p><a href="${repo}/blob/main/packages/core/README.md">Consulta la API y sus ejemplos ↗</a></p>
<h3>Las trece colecciones, con más detalle</h3><ul class="collection-docs">${links()}</ul></div>
<div><details open><summary>¿Necesito React o una API de imágenes?</summary><p>No. El núcleo funciona en navegador y Node con imports ESM. Usa lazy-avatars/react si necesitas el componente React, o /web-component, /cli y /http para esas integraciones. HTTP es autoalojable.</p></details>
<details><summary>¿Puedo usar los avatares en un proyecto comercial?</summary><p>Sí. El código y las trece colecciones originales están cubiertos por la licencia MIT del proyecto. Conserva el copyright y la licencia al redistribuir copias o partes sustanciales.</p></details>
<details><summary>¿La misma semilla conserva siempre el avatar?</summary><p>La misma colección, versión de salida, semilla normalizada y opciones efectivas producen los mismos bytes SVG. Fija la versión del paquete o guarda el SVG para conservar resultados históricos.</p></details>
<details><summary>¿Se envían mis datos a algún servidor?</summary><p>La generación se hace en tu navegador. La URL de la galería contiene la semilla: utiliza identidades ficticias al compartirla. No hay un servicio de imágenes ni analítica de la galería.</p></details></div></div>
<p class="discovery-links"><a href="comparison/">Comparar con Boring Avatars y DiceBear</a> · <a href="${repo}/releases">Publicaciones</a> · <a href="${repo}/blob/main/packages/core/CHANGELOG.md">Changelog</a></p>
<noscript><p>El generador interactivo necesita JavaScript. Puedes leer las colecciones, ejemplos y comparación sin activarlo.</p></noscript></section>`;
        return html
          .replace(/<title>.*?<\/title>/s, `<title>${title}</title>`)
          .replace(/\s*<meta name="description"[^>]*>/, '')
          .replace('</head>', `${metadata(title, description)}</head>`)
          .replace('<!-- discovery-content -->', content);
      },
    },
    generateBundle() {
      const emit = (fileName: string, source: string | Uint8Array) =>
        this.emitFile({ type: 'asset', fileName, source });
      for (const [id, name, title, description, use, options] of collections) {
        emit(
          `previews/${id}.svg`,
          readFileSync(new URL(`../../assets/previews/${id}.svg`, import.meta.url)),
        );
        const code = `import { createAvatar } from 'lazy-avatars';\nimport { ${id} } from 'lazy-avatars/${id}';\n\nconst svg = createAvatar(${id}, {\n  seed: 'Ada Moss',\n  size: 64,\n  shape: 'rounded',\n  options: ${options},\n});`;
        const path = `collections/${id}/`;
        emit(
          `${path}index.html`,
          page(
            `${title} · lazy-avatars`,
            description,
            path,
            `<h1>${escapeHtml(title)}</h1><p>${escapeHtml(name)} is one of the 13 original lazy-avatars collections. ${escapeHtml(description)}</p><div class="preview"><img src="../../previews/${id}.svg" width="128" height="128" alt="${escapeHtml(name)} avatar example"></div><h2>When to use ${escapeHtml(name)}</h2><p>${escapeHtml(use)}</p><h2>Install and render</h2><pre><code>npm install lazy-avatars@${escapeHtml(version)}</code></pre><pre><code>${escapeHtml(code)}</code></pre><p>This code demonstrates explicit collection options. The preview uses seed-selected defaults (Rack: demo-host-01 with status warn); changing options can change its appearance.</p><h2>React integration</h2><p>Install React 19 separately, then pass this collection to the optional component:</p><pre><code>${escapeHtml(`import { Avatar } from 'lazy-avatars/react';\nimport { ${id} } from 'lazy-avatars/${id}';\n\n<Avatar collection={${id}} seed="Ada Moss" size={64} title="Example profile" />;`)}</code></pre><h2>Determinism and license</h2><p>Same collection/output version, normalized seed and effective options produce identical SVG bytes. Collection outputVersion is 1. Pin the package or save the SVG to preserve historical output. Original artwork and code use this project's MIT license; no third-party fonts are bundled.</p><p><a href="${site}?collection=${id}&seed=Ada+Moss">Try ${escapeHtml(name)} in the interactive gallery</a> · <a href="${repo}/blob/main/packages/core/README.md">Full API contract</a></p><h2>Other collections</h2><ul>${links(site)}</ul>`,
          ),
        );
      }
      emit(
        'comparison/index.html',
        page(
          'lazy-avatars vs Boring Avatars vs DiceBear',
          'Compare SVG avatar libraries by local generation, React integration, artwork, licensing and hosted APIs. Maintained by the lazy-avatars project.',
          'comparison/',
          comparisonBody(),
        ),
      );
      const urls = [
        site,
        ...collections.map(([id]) => `${site}collections/${id}/`),
        `${site}comparison/`,
      ];
      emit(
        'sitemap.xml',
        `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map((url) => `<url><loc>${url}</loc></url>`).join('')}</urlset>`,
      );
      emit(
        'llms.txt',
        `# lazy-avatars\n\n> Deterministic SVG avatar library for JavaScript and TypeScript. 13 original collections, zero core runtime dependencies, optional React. Original code and art: MIT.\n\n- [Gallery and installation](${site})\n- [npm](https://www.npmjs.com/package/lazy-avatars)\n- [Source and API documentation](${repo})\n- [Comparison](${site}comparison/)\n${collections.map(([id, name]) => `- [${name}](${site}collections/${id}/)`).join('\n')}\n`,
      );
      emit(
        'social-preview.png',
        readFileSync(
          fileURLToPath(new URL('../../assets/previews/social-preview.png', import.meta.url)),
        ),
      );
    },
  };
}

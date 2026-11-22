import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import type { Plugin } from 'vite';

const site = 'https://lazyavatars.paulaquiin.com/';
const repo = 'https://github.com/paulaquiin/lazy-avatars';
const homeTitle = 'Librería de avatares SVG para JavaScript y TypeScript | lazy-avatars';
const homeDescription =
  'Librería de avatares SVG deterministas con 13 colecciones originales para JavaScript y TypeScript. Prueba la galería; React es opcional.';
const homeHeading =
  'Avatares SVG <span class="hero-highlight">con tu nombre</span> para JavaScript y TypeScript';
const homeIntro =
  'Prueba las 13 colecciones originales en la galería. El mismo nombre y los mismos ajustes crean el mismo avatar en tu proyecto. React es opcional.';
const version = JSON.parse(
  readFileSync(new URL('../../packages/core/package.json', import.meta.url), 'utf8'),
).version as string;

const collections = [
  [
    'mosaic',
    'Mosaico',
    'Avatares de mosaico geométrico',
    'Arcos y piezas triangulares forman un avatar geométrico para perfiles y equipos.',
    'Úsalo para distinguir miembros en listas y comentarios.',
    "{ tile: 'arcs' }",
  ],
  [
    'monogram',
    'Monograma',
    'Avatares de monogramas e iniciales',
    'Las iniciales originales aparecen en marcos circulares, escudos o rombos.',
    'Úsalo cuando las iniciales deban reconocerse sin cargar una fuente.',
    "{ frame: 'shield' }",
  ],
  [
    'rack',
    'Rack',
    'Avatares SVG de servidores',
    'Bastidores con iniciales pixeladas, discos o rejillas y luces de estado.',
    'Úsalo en paneles de infraestructura. Tu aplicación proporciona el estado; acompáñalo de texto. El avatar no monitoriza servidores.',
    "{ status: 'warn', unit: 'disks' }",
  ],
  [
    'siesta',
    'Siesta',
    'Avatares de personajes soñolientos',
    'Personajes redondos, con forma de pera o nube, con gorros, antifaces y mantas.',
    'Úsalos para perfiles de comunidad, compañeros o bots.',
    "{ accessory: 'zzz', body: 'round', mouth: 'yawn' }",
  ],
  [
    'origami',
    'Origami',
    'Avatares de animales de origami',
    'Pliegues geométricos forman zorros, gatos, osos y búhos.',
    'Úsalo en perfiles y equipos que quieran una silueta animal reconocible.',
    "{ animal: 'fox' }",
  ],
  [
    'pantry',
    'Despensa',
    'Avatares SVG de comida',
    'Dónuts, cítricos, huevos y aguacates dan sabor a cada perfil.',
    'Úsalo en comunidades de cocina, listas de miembros y perfiles de prueba.',
    "{ food: 'avocado' }",
  ],
  [
    'deco',
    'Déco',
    'Avatares geométricos Déco',
    'Abanicos, arcos y soles forman insignias inspiradas en el art déco.',
    'Úsalo para dar a un perfil una insignia geométrica ornamental.',
    "{ motif: 'fan' }",
  ],
  [
    'latte',
    'Latte',
    'Avatares de café y latte art',
    'Tazas con corazones, tulipanes, rosetas o anillos elegidos por la semilla.',
    'Úsalo en proyectos de cafetería, comunidades y bots con tema de café.',
    "{ art: 'tulip' }",
  ],
  [
    'constellation',
    'Constelación',
    'Avatares de constelaciones',
    'Una semilla crea un pequeño mapa estelar con puntos unidos.',
    'Úsalo en perfiles abstractos de tema espacial. Esta colección no tiene ajustes propios.',
    '{}',
  ],
  [
    'tinbot',
    'Hojalata',
    'Avatares SVG de robots',
    'Caras mecánicas con antenas, indicadores, visores y distintas bocas.',
    'Úsalo para identificar bots, cuentas de automatización y compañeros técnicos.',
    "{ antenna: 'double', eyes: 'visor', mouth: 'smile' }",
  ],
  [
    'orbit',
    'Órbita',
    'Avatares de planetas y órbitas',
    'Planetas con bandas o cráteres, anillos y una luna pequeña.',
    'Úsalo en equipos y perfiles de tema espacial.',
    "{ surface: 'bands', ring: 'wide', moon: 'small' }",
  ],
  [
    'mission',
    'Misión',
    'Avatares de misiones espaciales',
    'Emblemas con iniciales originales, cohetes y planetas.',
    'Úsalo como insignia de equipos, proyectos y comunidades espaciales.',
    "{ badge: 'shield', planet: 'ringed', rocket: 'tilted' }",
  ],
  [
    'helmet',
    'Casco',
    'Avatares de cascos de astronauta',
    'Cascos con visores redondos, anchos o angulares y reflejos de planetas o lunas.',
    'Úsalo para perfiles de exploradores en interfaces de tema espacial.',
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
  const markdown =
    path === ''
      ? `${site}index.md`
      : ['docs/', 'contact/', 'privacy/'].includes(path)
        ? `${site}${path}index.md`
        : null;
  const schema =
    path === ''
      ? {
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: 'lazy-avatars',
          description,
          url,
          applicationCategory: 'DeveloperApplication',
          softwareVersion: version,
          downloadUrl: 'https://www.npmjs.com/package/lazy-avatars',
          softwareHelp: `${site}docs/`,
          license: `${repo}/blob/main/LICENSE`,
          sameAs: repo,
        }
      : path === 'contact/' || path === 'privacy/'
        ? {
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: title,
            description,
            url,
            isPartOf: site,
          }
        : {
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
            sameAs: repo,
          };
  return `<meta name="description" content="${escapeHtml(description)}">
<link rel="canonical" href="${url}">
${markdown ? `<link rel="alternate" type="text/markdown" href="${markdown}">` : ''}
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
<script type="application/ld+json">${JSON.stringify(schema).replaceAll('<', '\\u003c')}</script>`;
}

const links = (prefix = '') =>
  collections
    .map(([id, name]) => `<li><a href="${prefix}collections/${id}/">${name} / ${id}</a></li>`)
    .join('');

function page(title: string, description: string, path: string, body: string, lang = 'es') {
  const fontPath = `${'../'.repeat(path.split('/').filter(Boolean).length)}fonts/fonts.css`;
  return `<!doctype html><html lang="${lang}"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)}</title>${metadata(title, description, path)}
<link rel="stylesheet" href="${fontPath}">
<style>body{font:17px/1.65 "Mulish",system-ui,sans-serif;background:#f6f3ec;color:#243b35;margin:0}main{max-width:960px;padding:32px 24px;margin:auto}a{color:#315647;text-underline-offset:3px}nav{display:flex;gap:20px;flex-wrap:wrap}h1,h2{font-family:"Arima Madurai",Georgia,serif}h1{font-size:clamp(30px,5vw,48px);line-height:1.15}h2{margin-top:32px}pre{overflow:auto;padding:20px;background:#fffdf8;border:1px solid #cbd5c6;border-radius:12px}img{max-width:100%}table{border-collapse:collapse;font-size:15px}th,td{border:1px solid #cbd5c6;padding:12px;text-align:left;vertical-align:top}.table-scroll{overflow:auto}ul{padding-left:24px}footer{margin-top:40px;border-top:1px solid #cbd5c6;padding-top:16px}.preview{display:flex;gap:20px;flex-wrap:wrap}</style>
</head><body><main><nav aria-label="Navegación principal"><a href="${site}">Galería</a><a href="${site}docs/">Documentación</a><a href="${site}comparison/">Comparativa</a><a href="https://www.npmjs.com/package/lazy-avatars">npm</a><a href="${repo}">GitHub</a></nav>${body}<footer>Proyecto <a href="${repo}">lazy-avatars</a>. Código e ilustraciones originales bajo <a href="${repo}/blob/main/LICENSE">licencia MIT</a>. <a href="${site}contact/">Contacto</a> · <a href="${site}privacy/">Privacidad</a>. El proyecto no aloja una API pública de imágenes.</footer></main></body></html>`;
}

function docsBody(markdown: string) {
  const inline = (value: string) =>
    escapeHtml(value)
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\[([^\]]+)\]\((https:\/\/[^)]+)\)/g, '<a href="$2">$1</a>');
  const blocks: string[] = [];
  let current: string[] = [];
  let inCode = false;
  for (const line of markdown.trim().split('\n')) {
    if (
      !inCode &&
      current.length &&
      (line.startsWith('# ') ||
        line.startsWith('## ') ||
        line.startsWith('```') ||
        (line.startsWith('- ') && !current[0]?.startsWith('- ')))
    ) {
      blocks.push(current.join('\n'));
      current = [];
    }
    if (line.startsWith('```')) inCode = !inCode;
    if (!inCode && line.trim() === '') {
      if (current.length) blocks.push(current.join('\n'));
      current = [];
    } else {
      current.push(line);
    }
  }
  if (current.length) blocks.push(current.join('\n'));
  if (inCode) throw new Error('Bloque de código sin cerrar en la documentación');
  const anchor = (heading: string) =>
    heading
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  return blocks
    .map((block) => {
      if (block.startsWith('```')) {
        const match = /^```[a-z]*\n([\s\S]*?)\n```$/.exec(block);
        if (!match) throw new Error('Bloque de código inválido en la documentación');
        return `<pre><code>${escapeHtml(match[1] ?? '')}</code></pre>`;
      }
      if (block.startsWith('# ')) return `<h1>${inline(block.slice(2))}</h1>`;
      if (block.startsWith('## '))
        return `<h2 id="${anchor(block.slice(3))}">${inline(block.slice(3))}</h2>`;
      if (block.startsWith('- '))
        return `<ul>${block
          .split('\n')
          .map((line) => `<li>${inline(line.slice(2))}</li>`)
          .join('')}</ul>`;
      return `<p>${inline(block.replaceAll('\n', ' '))}</p>`;
    })
    .join('\n');
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
        const content = `<section class="api-guide" id="api-guide" aria-labelledby="api-guide-title"><div class="api-guide-copy"><h2 id="api-guide-title" class="heading-square">La API de lazy-avatars</h2>
<p>Consulta <code>createAvatar</code> y los ejemplos para JavaScript y TypeScript. Genera un SVG con la <a href="${site}docs/#cli-genera-un-archivo-svg">CLI</a> o aloja el <a href="${site}docs/#http-autoalojable">servidor HTTP</a> en tu infraestructura.</p></div>
<div class="api-guide-action"><span id="api-arrival" class="api-arrival" aria-hidden="true"></span><a class="api-guide-link" href="${site}docs/">Lee la documentación</a></div></section>
<section class="discovery" aria-labelledby="faq-title"><h2 id="faq-title" class="heading-square">Preguntas frecuentes</h2><div class="discovery-faq"><details open><summary>¿Necesito React o una API de imágenes?</summary><p>No. Puedes probar los avatares aquí y generarlos en tu proyecto con JavaScript o TypeScript. React es opcional; también puedes alojar la integración HTTP en tu servidor.</p></details>
<details><summary>¿Puedo usar los avatares en un proyecto comercial?</summary><p>Sí. Puedes usarlos comercialmente. Si distribuyes copias de los SVG, el código o partes sustanciales de la librería, incluye el aviso <code>Copyright (c) 2026 lazy-avatars contributors</code>.</p></details>
<details><summary>¿El mismo texto crea siempre el mismo avatar?</summary><p>Sí, si mantienes la misma versión del paquete, colección y ajustes. Si quieres conservarlo después de actualizar, guarda el SVG.</p></details>
<details><summary>¿Se envía el texto a algún servidor?</summary><p>La galería genera los avatares en tu navegador. El enlace para compartir incluye el nombre o texto que hayas escrito: usa datos ficticios si vas a publicarlo. La galería no utiliza un servicio de imágenes ni analítica.</p></details></div>
<noscript><p>El generador interactivo necesita JavaScript. Puedes leer las colecciones y ejemplos sin activarlo.</p></noscript></section>`;
        return html
          .replace(/<title>.*?<\/title>/s, `<title>${homeTitle}</title>`)
          .replace(/\s*<meta name="description"[^>]*>/, '')
          .replace('</head>', `${metadata(homeTitle, homeDescription)}</head>`)
          .replace(
            /<h1 class="heading-square">.*?<\/h1>/s,
            `<h1 class="heading-square">${homeHeading}</h1>`,
          )
          .replace(
            /<p class="hero-description">.*?<\/p>/s,
            `<p class="hero-description">${homeIntro}</p>`,
          )
          .replace('<!-- discovery-content -->', content);
      },
    },
    generateBundle() {
      const emit = (fileName: string, source: string | Uint8Array) =>
        this.emitFile({ type: 'asset', fileName, source });
      for (const [path, source, title, description] of [
        [
          'docs/',
          'docs.md',
          'Documentación de la API de lazy-avatars para JavaScript y TypeScript',
          'Instala lazy-avatars y genera SVG deterministas. Referencia de createAvatar, ejemplos para React, CLI y servidor HTTP autoalojable.',
        ],
        [
          'contact/',
          'contact.md',
          'Contacto | lazy-avatars',
          'Consulta cómo comunicar fallos y dudas sobre la librería lazy-avatars en el repositorio de GitHub.',
        ],
        [
          'privacy/',
          'privacy.md',
          'Privacidad de la galería | lazy-avatars',
          'Cómo utiliza la galería de lazy-avatars el texto del generador, los enlaces para compartir y los sitios externos.',
        ],
      ] as const) {
        const markdown = readFileSync(new URL(`./content/${source}`, import.meta.url), 'utf8');
        emit(`${path}index.md`, markdown);
        emit(`${path}index.html`, page(title, description, path, docsBody(markdown)));
      }
      emit(
        'index.md',
        `# lazy-avatars: avatares SVG para JavaScript y TypeScript\n\n${homeDescription}\n\n${homeIntro}\n\n- [Prueba el generador](${site}#playground)\n- [Documentación de la API](${site}docs/)\n- [CLI y servidor HTTP autoalojable](${site}docs/#cli-genera-un-archivo-svg)\n- [Colecciones](${site}#collections)\n- [Código fuente](${repo})\n`,
      );
      emit('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${site}sitemap.xml\n`);
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
            `<h1>${escapeHtml(title)}</h1><p>${escapeHtml(name)} es una de las 13 colecciones originales de lazy-avatars. ${escapeHtml(description)}</p><div class="preview"><img src="../../previews/${id}.svg" width="128" height="128" alt="Ejemplo de avatar ${escapeHtml(name)}"></div><h2>Cuándo usar ${escapeHtml(name)}</h2><p>${escapeHtml(use)}</p><h2>Instala y genera el SVG</h2><pre><code>npm install lazy-avatars@${escapeHtml(version)}</code></pre><pre><code>${escapeHtml(code)}</code></pre><p>El código muestra ajustes propios de la colección. La vista previa usa ajustes elegidos por la semilla (Rack: demo-host-01 con estado warn); si cambias los ajustes, el resultado puede variar.</p><h2>Integración con React</h2><p>Instala React 19 por separado y pasa esta colección al componente opcional:</p><pre><code>${escapeHtml(`import { Avatar } from 'lazy-avatars/react';\nimport { ${id} } from 'lazy-avatars/${id}';\n\n<Avatar collection={${id}} seed="Ada Moss" size={64} title="Avatar de ejemplo" />;`)}</code></pre><h2>Repetibilidad y licencia</h2><p>La misma versión de salida, semilla normalizada y configuración efectiva producen el mismo SVG. Fija la versión del paquete o guarda el SVG si necesitas conservarlo tras una actualización. El código y las ilustraciones originales tienen licencia MIT; las fuentes de la web usan SIL OFL y no forman parte del SVG generado.</p><p><a href="${site}docs/">Consulta la documentación de la API</a></p><h2>Otras colecciones</h2><ul>${links(site)}</ul>`,
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
          'en',
        ),
      );
      const urls = [
        site,
        `${site}docs/`,
        `${site}contact/`,
        `${site}privacy/`,
        ...collections.map(([id]) => `${site}collections/${id}/`),
        `${site}comparison/`,
      ];
      emit(
        'sitemap.xml',
        `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map((url) => `<url><loc>${url}</loc></url>`).join('')}</urlset>`,
      );
      emit(
        'llms.txt',
        `# lazy-avatars\n\n> Librería de avatares SVG deterministas para JavaScript y TypeScript. 13 colecciones originales y React opcional.\n\n## Cuándo usarla\n\nPara generar avatares SVG de perfiles, equipos y bots a partir de una semilla en tu aplicación. Instala el paquete; si necesitas un archivo desde un script, usa la CLI. El servidor HTTP se aloja por tu cuenta.\n\n- [Galería](${site})\n- [Documentación de la API](${site}docs/)\n- [Documentación en Markdown](${site}docs/index.md)\n- [Ficha del paquete en el registro npm](https://registry.npmjs.org/lazy-avatars/latest)\n- [Código fuente](${repo})\n- [Contacto](${site}contact/)\n- [Privacidad](${site}privacy/)\n- [Comparativa](${site}comparison/)\n${collections.map(([id, name]) => `- [${name}](${site}collections/${id}/)`).join('\n')}\n`,
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

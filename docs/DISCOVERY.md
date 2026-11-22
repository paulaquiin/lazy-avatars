# Discovery and publication checklist

This project is an SVG avatar library for JavaScript/TypeScript profiles, teams,
servers and bots. Its core has no runtime dependencies. It includes thirteen
original collections, optional integrations and MIT-licensed original artwork.

## Public surfaces

- GitHub About: description, gallery homepage and the avatar/SVG/framework topics.
- npm manifest: the same description, keywords, homepage and issue tracker.
  Manifest/README changes reach npm only after a new package version is published.
- Gallery HTML: useful text and installation example before JavaScript runs;
  canonical URL, description, Open Graph and Twitter card with a 1200×630 PNG.
- Thirteen static collection pages under `collections/<id>/`, with distinct
  descriptions, use cases, original previews and typed integration examples.
- [Comparison](comparison.md): owned by this project, dated and sourced from the
  official documentation of all three libraries. No unmeasured performance claims.
- [`sitemap.xml`](https://lazyavatars.paulaquiin.com/sitemap.xml): home,
  documentation, thirteen collection pages and comparison; query-string gallery states are omitted.
- [`docs/`](https://lazyavatars.paulaquiin.com/docs/): Spanish quickstart, core API,
  React, CLI and self-hosted HTTP. It is generated from `apps/gallery/content/docs.md`.
- [`contact/`](https://lazyavatars.paulaquiin.com/contact/) and
  [`privacy/`](https://lazyavatars.paulaquiin.com/privacy/): factual contact and
  gallery-data explanations, generated from Markdown sources.
- [`index.md`](https://lazyavatars.paulaquiin.com/index.md) and
  [`docs/index.md`](https://lazyavatars.paulaquiin.com/docs/index.md), plus the
  Contact and Privacy Markdown twins: alternatives linked from their HTML pages.
- [`robots.txt`](https://lazyavatars.paulaquiin.com/robots.txt): allows crawling and
  points to the sitemap.
- [`llms.txt`](https://lazyavatars.paulaquiin.com/llms.txt): a small index of
  the same public documentation. It links to the npm registry JSON because the
  npm website can challenge automated requests. It is optional convenience,
  not a ranking guarantee.
- README badges: registry version/downloads, existing CI and MIT license. Bundle
  measurements refer to the reachable core ESM graph, not the entire tarball.

The build plugin `apps/gallery/seo.ts` emits these files with Vite; it needs no
extra runtime dependency or client-side router. Markdown comparison source stays
in `docs/comparison.md`. Social artwork is `assets/previews/social-preview.png`.

## Search Console and Bing: account-owner actions

1. In Google Search Console, add the URL-prefix property
   `https://lazyavatars.paulaquiin.com/` and complete ownership verification.
2. Submit `https://lazyavatars.paulaquiin.com/sitemap.xml` in Sitemaps.
3. Add/import the site in Bing Webmaster Tools, verify access and submit the same sitemap.
4. Inspect the home, Rack and comparison URLs; review indexing and crawl errors.
5. Check brand searches for `lazy-avatars avatares SVG` and
   `lazy-avatars JavaScript TypeScript`; record the engine, date and result URL.
6. After deployment, request `/robots.txt`, `/sitemap.xml`, `/docs/`,
   `/contact/`, `/privacy/` and their Markdown twins on the custom domain.
   Check HTTP status, sitemap URLs, Markdown bodies and
   `Content-Type: text/markdown`. Confirm the HTML pages advertise their
   Markdown alternatives.

Verification files/meta tags must come from those accounts. Do not invent a token
or claim that submission or indexing happened without checking the account.
The custom domain serves this gallery at the host root. Verify the deployed
`robots.txt`, sitemap and Markdown Content-Type after deployment; a local build
only proves that Vite emitted the files.

## Examples and outreach: prepare, then request publication

Two working example apps already live in this repository:
- [Vanilla TypeScript gallery](../apps/gallery): `pnpm dev`.
- [React SSR/hydration and web component](../apps/integrations): after
  `pnpm build`, run `pnpm --filter @lazy-avatars/integration-examples preview`.

External StackBlitz/CodeSandbox projects are not claimed as verified or published.
Create and run them on the destination before linking them as working demos.

Potential outreach targets are curated React/SVG/identicon lists and relevant
developer communities. Read each destination's contribution/self-promotion rules
and check for an existing entry first. Offer a concrete example and disclose that
the author maintains lazy-avatars. Do not open competitor issues just to advertise,
post irrelevant Stack Overflow answers, manufacture endorsements or bulk-post.
No external post, issue or PR is sent by this checklist.

Starting draft for a maintainer-approved post:

> I maintain lazy-avatars, an MIT-licensed JavaScript/TypeScript SVG avatar library.
> It has 13 original collections for profiles, teams, servers and bots, a core with
> no runtime dependencies, and optional React/web component/CLI/HTTP entries in one
> npm package. Generation runs locally. The original art is covered by the project's
> MIT license. Try the gallery and compare styles before choosing it for your app.
> Source: https://github.com/paulaquiin/lazy-avatars
> Gallery: https://lazyavatars.paulaquiin.com/

## Measure without promising placement

Record a baseline for queries such as “deterministic SVG avatar library”, “React
avatar generator”, “server rack avatar SVG” and “lazy-avatars vs DiceBear”. Record
engine, date, query, retrieved URL, mention/citation and sample count; repeat the
same small sample after indexing. There is no scheduled monitor or analytics added.

Google documents that normal Search practices apply to AI features and no special
AI file is required: [official guidance](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide).
Metadata, comparisons, backlinks or badges do not guarantee ranking or AI citations.

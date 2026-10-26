# Personal notes

An Astro site for Matt’s notes on code, design, and AI. The index has excerpt previews and a progressively enhanced article overlay. Every note also has a permanent, server-rendered URL; navigation and reading work without JavaScript.

## Local development

Use Node.js 24 (see `.nvmrc`).

```sh
npm ci
npm run dev
```

The local address includes `/personal-notes/`, matching GitHub Pages.

```sh
npm run check
npm run build
npm test
npm run preview
```

Fonts are bundled locally. No accounts, database, analytics, or third-party font requests are required.

## Writing

Add or edit a Markdown file in `src/content/notes/`. Filenames become permanent URLs. Frontmatter is validated by `src/content.config.ts`:

```yaml
title: A useful note
description: A short excerpt for the index and search engines.
category: Essay
topic: DESIGN
minutes: 3
order: 7
featured: false
draft: true
```

Set `draft: false` to publish. Use `###` for article sections; longer notes get a section outline. Existing illustrations are editable SVG embedded in the Markdown, with separate desktop and mobile compositions. The published note is a personal companion to the longer Uno Platform article. The original essay is preserved as an unpublished draft, and the five prototype samples have been removed.

## Deployment

Repository: `noknowscode/personal-notes`. Expected URL: `https://noknowscode.github.io/personal-notes/`.

In repository Settings → Pages, use **GitHub Actions** as the source. Every push to `main` checks, builds, tests, and deploys through `.github/workflows/deploy.yml`. Deployment stops if validation fails.

To rename the repository or add a custom domain, update `site` and `base` in `astro.config.mjs`, and the base-path assertions in `tests/build.test.mjs`. Keep the trailing slash so asset and article URLs resolve consistently.

## Structure

- `src/content/notes/`: writing and inline illustrations
- `src/components/MarginStudy.astro`: featured illustration
- `src/layouts/Base.astro`: document metadata, fonts, navigation
- `src/pages/`: index, article routes, RSS, sitemap, and 404
- `src/scripts/site.ts`: reading overlay, progress, accessibility enhancements
- `src/styles/global.css`: design system and responsive layouts

No generated output, credentials, or local runtime files are committed.

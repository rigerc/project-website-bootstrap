---
title: Configuration
description: Edit the single-project configuration and documentation routes.
sidebar:
  order: 3
---

## Project content

Edit `src/config/project.config.ts` to set the project identity, hero, and sections. This example configures a game with a screenshot and a single link.

```ts
const demoUrl = 'https://example.com/play';

export const project: ProjectConfig = {
  name: 'Pocket Observatory',
  description: 'A puzzle game about mapping the night sky.',
  accentColor: '#ef9554',
  repository: '',
  demoUrl,
  hero: {
    headline: 'Map the stars.\n*Find your way home.*',
    summary: 'Connect constellations to solve a new puzzle each night.',
    actions: [{ label: 'Play the demo', href: demoUrl, variant: 'primary' }],
    visual: { type: 'image', src: '/screenshots/game.png', alt: 'A constellation puzzle in progress' },
  },
  sections: [],
};
```

Choose a `terminal`, `image`, or `video` hero visual, or omit `visual` for a text-only hero. Put local media in `public/` and use URLs such as `/screenshots/game.png`. In headings, `\n` starts a new line and `*text*` uses the accent color. Actions with an empty `href` are hidden. Set `repository` to an empty string to hide the source link in the docs.

Arrange `sections` in the order they should appear. The supported types are `features`, `steps`, `media`, `faq`, and `cta`. Give each section a unique `id` and an optional `nav` label to add it to the header. List sections with empty `items` are skipped. To use your own screenshot or video in a media tile, set the item's `image` or `video` field.

Before publishing, run `pnpm check:site --strict` to catch the template's placeholder project name, repository URL, and terminal title in the generated HTML. Plain `pnpm check:site` reports them as warnings.

The docs are in `src/content/docs/docs/*.md`. Starlight is configured under `starlight()` in `astro.config.mjs` and the `docs` content collection in `src/content.config.ts`.

## URL layout

| URL | Owner |
| --- | --- |
| `/` | Astro landing page (`src/pages/index.astro`) |
| `/docs/` | Starlight documentation index |
| `/docs/getting-started/` | Quick start |
| `/docs/configuration/` | This page |
| `/docs/media/` | Visual media pipeline |
| `/docs/deployment/` | Deployment guidance |

## Navigation and metadata

`src/config/nav.config.ts` controls shared navigation links such as Home and Docs. Starlight adds Markdown pages to its sidebar automatically. Set `sidebar.order` and `sidebar.label` in a page's frontmatter to customize its position and label. Set the canonical origin with `SITE_URL=https://your-domain.example` during build.

## Styling

The `accentColor` hex value tints the homepage, header, documentation, favicon, and generated social cards. Edit `src/styles/project.css` to change the homepage layout or background colors.

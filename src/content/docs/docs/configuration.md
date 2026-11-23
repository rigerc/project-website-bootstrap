---
title: Configuration
description: Edit the single-project configuration and documentation routes.
---

## Project content

The homepage's editable content is in `src/config/project.config.ts`:

```ts
export const project = {
  name: 'Your Project',
  headline: 'Your project headline',
  summary: 'What it does and who it helps',
  repository: 'https://github.com/YOU/REPO',
  demoUrl: '',
  // ...
} as const;
```

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

`src/config/nav.config.ts` controls the Astro Rocket header and footer. The Starlight sidebar is configured in `astro.config.mjs`. Set the canonical URL with `SITE_URL=https://your-domain.example` during build.

## Styling

`src/styles/project.css` is isolated beneath `.project-site`. The rest of Astro Rocket's component system remains available. The docs use Starlight's own accessible layout and styles to avoid leaking homepage theme styles into documentation.

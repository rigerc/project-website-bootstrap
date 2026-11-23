---
title: Getting started
description: Run and personalize your single-project Astro website.
---

## Requirements

- Node.js **22.23.4 or newer**
- pnpm **10.33.0**, using the `packageManager` field and Corepack
- Git, plus a GitHub fork of the [Astro Rocket repository](https://github.com/hansmartensdev/Astro-Rocket)

## Local development

```bash
# In your forked repository
corepack enable
pnpm install
cp .env.example .env
pnpm dev
```

The homepage is available at `http://localhost:4321/` and the Starlight docs at `http://localhost:4321/docs/`.

## Make it yours

1. Open `src/config/project.config.ts` and replace the project name, headline, summary, features, GitHub repository URL, and calls to action.
2. Open `src/config/branding.ts` and set `SITE_NAME` and `THEME_COLOR`.
3. Open `src/config/site.config.ts` for SEO, author, and organization details. Set `SITE_URL` in the deployment environment.
4. Edit the markdown files in `src/content/docs/docs/`.
5. Replace example assets and verify all links point to your actual project.

## Test your build

```bash
pnpm check
pnpm build
pnpm preview
```

Use the [media workflow](/docs/media/) once the site builds successfully. Do not publish placeholder metadata or example URLs in production.

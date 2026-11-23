---
title: Getting started
description: Run and personalize your single-project Astro website.
sidebar:
  order: 2
---

## Requirements

- Node.js **22.23.4 or newer**
- pnpm **10.33.0**, using the `packageManager` field and Corepack
- Git and a copy of this template

## Local development

If you already have a project repository, see [Add to an existing project](../integrate/) for a setup that keeps the site in its own directory.

```bash
# In your forked repository
corepack enable
pnpm install --frozen-lockfile
cp .env.example .env
pnpm dev
```

The homepage is available at `http://localhost:4321/` and the Starlight docs at `http://localhost:4321/docs/`.

## Make it yours

1. Open `src/config/project.config.ts` and set the project name, description, and `accentColor`.
2. Customize the hero, sections, and links in the same file. Use the [configuration guide](../configuration/) to choose a hero visual and add screenshots.
3. Open `src/config/site.config.ts` for SEO, author, and organization details. Set `SITE_URL` in the deployment environment.
4. Edit the markdown files in `src/content/docs/docs/`.
5. Replace example assets and verify all links point to your actual project.

## Test your build

```bash
pnpm check
pnpm build
pnpm check:site --strict
pnpm preview
```

Use the [media workflow](../media/) once the site builds successfully. Do not publish placeholder metadata or example URLs in production.

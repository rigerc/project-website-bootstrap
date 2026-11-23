---
title: Deployment
description: Build and deploy the Astro project homepage and Starlight docs together.
sidebar:
  order: 5
---

## Build

```bash
pnpm install --frozen-lockfile
SITE_URL=https://your-actual-domain.example pnpm build
```

The default build writes static files to `dist/`, including `index.html` and `docs/index.html`. Publish that directory on a static host and route `/docs/` to the generated docs.

## GitHub Pages

The **Deploy to GitHub Pages** workflow builds and publishes the site when a release is published, or manually via **Actions → Deploy to GitHub Pages → Run workflow**. Pushes and pull requests run lint, type checks, and VHS tests. In the repository settings, set **Pages → Source** to **GitHub Actions**.

A project site is served below a sub-path such as `/project-website-bootstrap/`. The workflow reads that path from `actions/configure-pages` and passes it to the build as `BASE_PATH`; with a custom domain it is empty and the site is served from the root. To reproduce it locally:

```bash
SITE_URL=https://USER.github.io BASE_PATH=/REPO pnpm build
```

Hand-written root-absolute links must go through `withBase()` from `src/lib/base.ts`, and links inside the docs markdown should be relative (`./media/`).

## Validation

```bash
pnpm check
pnpm lint
pnpm build
```

CI also checks the built homepage and documentation routes. The visual media workflow exercises the same built preview in Chromium.

## Before production

- Set `SITE_URL` to the real canonical origin.
- Replace placeholder repository links, contact metadata, and project copy.
- Confirm `/`, `/docs/`, `/docs/getting-started/`, and `/404` routes.
- Review the generated screenshots and MP4 after CI completes.
- Keep the upstream `LICENSE` and attribution in your fork.

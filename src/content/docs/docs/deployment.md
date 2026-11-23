---
title: Deployment
description: Build and deploy the Astro project homepage and Starlight docs together.
---

## Build

```bash
pnpm install # generates a lockfile from the newly added dependencies
SITE_URL=https://your-actual-domain.example pnpm build
```

Commit the generated `pnpm-lock.yaml`. Once it is committed, update CI from `pnpm install --no-frozen-lockfile` to `pnpm install --frozen-lockfile`.

The generated static output includes `/index.html` and `/docs/index.html`. Use Astro Rocket's supported deployment target or a static site host. For fully static hosting, ensure the build is configured to emit static HTML and that hosting rewrites do not shadow the `/docs/` pages.

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

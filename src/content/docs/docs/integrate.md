---
title: Add to an existing project
description: Add the Astro website to an existing repository and publish it alongside your project releases.
sidebar:
  order: 2.5
---

Add the site under `website/` in your existing repository. The site has its own dependencies, build, and output directory, so the project can keep its current tooling. If the project already publishes a website to GitHub Pages, integrate the new site into that deployment, or publish it from a separate repository or host.

## Copy the template

From the root of your project repository, run the following in Bash. Use an unused directory name in place of `website` if needed. The commands copy only the files needed for the website and keep your project's Git history and root configuration in place.

```bash
template_checkout=$(mktemp -d)
git clone --depth 1 https://github.com/rigerc/project-website-bootstrap.git "$template_checkout" &&
mkdir website &&
git -C "$template_checkout" archive HEAD -- \
  src public scripts astro.config.mjs tsconfig.json \
  package.json pnpm-lock.yaml pnpm-workspace.yaml \
  eslint.config.js vitest.config.ts .prettierrc .prettierignore \
  Dockerfile .dockerignore nginx.conf nginx-security-headers.conf \
  .env.example .gitignore .nvmrc README.md LICENSE |
  tar -x -C website
```

Keep `website/LICENSE` with the copied files. If your repository already has a pnpm workspace, these instructions treat `website/` as a standalone package with its own lockfile. If you choose to add it as a workspace member, use the root lockfile and workspace install in CI, and include its required build dependencies (`esbuild` and `sharp`) in the workspace's pnpm settings.

## Configure and preview

Use Node.js 22.23.4 or newer and pnpm 10.33.0. Start the site from the project root.

```bash
cd website
pnpm install --frozen-lockfile
pnpm dev
```

If Sharp tries to compile against a system-installed libvips, retry with `SHARP_IGNORE_GLOBAL_LIBVIPS=1 pnpm install --frozen-lockfile`. [Sharp installation guide](https://sharp.pixelplumbing.com/install/#building-from-source)

Open `http://localhost:4321/` for the homepage and `http://localhost:4321/docs/` for the docs.

1. Set the name, description, accent color, and repository URL in `website/src/config/project.config.ts`. Point the hero and section links at your project's real install instructions, source, or demo. Choose a screenshot, video, terminal preview, or a text-only hero.
2. Replace the example pages under `website/src/content/docs/docs/` with your project's documentation. If you rename or remove a sample page, update links to it in the project and navigation configs. Keep an index page for `/docs/`.
3. Put screenshots and other public files under `website/public/`. Use a URL such as `/screenshots/app.png` in the project config, even if the published site lives under a subpath.

Stop the dev server and run these checks from `website/` after replacing the placeholders:

```bash
pnpm lint
pnpm check
pnpm build
pnpm check:site --strict
```

See the [configuration guide](../configuration/) for a sample project config.

## Deploy with your existing releases

For GitHub Pages, copy the template's `.github/workflows/pages.yml` into the **project repository's** `.github/workflows/`. You can rename the file to avoid colliding with an existing workflow. Add this block at workflow level so shell steps run from the website directory:

```yaml
defaults:
  run:
    working-directory: website
```

Set the following inputs on the matching action steps. Action inputs use repository-relative paths, so they still need the `website/` prefix. [Workflow defaults](https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/set-default-values-for-jobs), [pnpm setup](https://github.com/pnpm/action-setup/tree/v4#package_json_file), [Node setup](https://github.com/actions/setup-node/tree/v4#caching-global-packages-data)

| Action | Input | Value |
| --- | --- | --- |
| `pnpm/action-setup` | `package_json_file` | `website/package.json` |
| `actions/setup-node` | `cache-dependency-path` | `website/pnpm-lock.yaml` |
| `actions/upload-pages-artifact` | `path` | `website/dist` |

Set **Settings → Pages → Source** to **GitHub Actions**. Once the workflow is on the default branch, try **Actions → Deploy to GitHub Pages → Run workflow**. The existing `release: published` trigger builds from the release tag, so future tags need to include the website files. If your release workflow publishes with `GITHUB_TOKEN`, add the site deployment to that workflow or use the manual trigger, since a release created with that token does not start another workflow. [Release events](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#release), [Triggering a workflow from a workflow](https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/trigger-a-workflow#triggering-a-workflow-from-a-workflow)

Keep the Pages configuration step in place. It supplies the public origin and base path, such as `/my-project` for `https://OWNER.github.io/my-project/`. The local directory name `website/` has no effect on the public URL.

For a different host, set its project directory to `website/`, build with `pnpm build`, and publish `dist/` from that directory. Set `SITE_URL` to the public origin and `BASE_PATH` to the public path prefix when needed. See the [deployment guide](../deployment/).

## Optional checks and media

Copy `deploy.yml` for website linting and type checks, and `visual-media.yml` for release screenshots and recordings. Place both under the project repository's `.github/workflows/`. Apply the same working-directory, pnpm manifest, and lockfile changes. In `visual-media.yml`, change the upload path to `website/media-output/`. If you use a different default branch, update the branch filters in `deploy.yml`.

The quality workflow runs on pushes and pull requests. The Pages and media workflows build on published releases and manual runs. Update `website/scripts/media/tapes/quickstart.tape` if you want the terminal recording to demonstrate your actual project. See the [media guide](../media/).

# Single-project Astro site

A configurable homepage and documentation site for one personal project. Change the copy, accent color, sections, and media in one file.

Built from [Astro Rocket](https://github.com/hansmartensdev/Astro-Rocket) by Hans Martens, with [Starlight](https://starlight.astro.build/) documentation, Playwright website captures, and [VHS CLI](https://github.com/charmbracelet/vhs) terminal recordings.

## Develop

```bash
corepack enable
pnpm install --frozen-lockfile
cp .env.example .env
pnpm dev
```

Edit `src/config/project.config.ts` for the site name, accent color, homepage sections, links, and media. Edit Markdown under `src/content/docs/docs/` to update `/docs/`. The [configuration guide](src/content/docs/docs/configuration.md) shows how to set up a homepage for your project.

## Add to an existing project

Put the site in a `website/` subdirectory and keep your project's existing dependencies and tooling. The [integration guide](src/content/docs/docs/integrate.md) covers copying the template, validating the site, and deploying it from your project's releases.

## Test and build

```bash
pnpm lint
pnpm check
pnpm build
pnpm check:site
pnpm preview
```

## Generate screenshots and video

Run a production preview with `pnpm preview --port 4321 --strictPort`, then (the scripts refuse to capture if something else is answering on that port):

```bash
pnpm exec playwright install chromium
pnpm media:capture
pnpm media:video     # browser MP4; requires ffmpeg
pnpm media:vhs       # terminal screenshot + GIF + MP4; requires VHS/ttyd/ffmpeg or Docker
# Force the official VHS container instead:
pnpm media:vhs --docker
# Or run all three captures while preview is running:
pnpm media:all --docker
```

Output: `media-output/screenshots/*.png`, `media-output/videos/walkthrough.{webm,mp4}`, and `media-output/vhs/quickstart.{png,gif,mp4}`. VHS takes terminal screenshots; it does not replace Playwright for webpage screenshots. Edit `scripts/media/tapes/quickstart.tape` to change the terminal demo. These files are excluded from Git. The **Visual media** GitHub Actions workflow uses the official pinned VHS container and runs when a release is published and on demand. It uploads the files as artifacts; it does not commit them or deploy the site.

For a Flutter or other Android app already open on an emulator or device, install Android Platform Tools and run `pnpm media:android screenshot --name home` or `pnpm media:android record --name walkthrough --seconds 20`. The files go to `media-output/android/`. Android capture runs on demand, independently of the site preview. See the [media guide](src/content/docs/docs/media.md#capture-an-android-app) for device selection and CI integration.

## Publishing

Set **Settings → Pages → Source** to **GitHub Actions**. The Pages workflow builds, checks, and publishes the site on published releases and manual runs. Pushes and pull requests run lint, type checks, and VHS tests. For other hosts, set `SITE_URL` to the canonical origin and publish the static files in `dist/`. [Deployment guide](src/content/docs/docs/deployment.md)

## Provenance

Keep the original MIT `LICENSE` and preserve attribution. This is a fork customization; it is not affiliated with the upstream theme developer.

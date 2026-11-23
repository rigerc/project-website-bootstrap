# Your Project — single-project Astro site

Built from [Astro Rocket](https://github.com/hansmartensdev/Astro-Rocket) by Hans Martens, with [Starlight](https://starlight.astro.build/) documentation, Playwright website captures, and [VHS CLI](https://github.com/charmbracelet/vhs) terminal recordings.

## Develop

```bash
corepack enable
pnpm install --frozen-lockfile
cp .env.example .env
pnpm dev
```

The homepage is `/`, the docs are at `/docs/`. Edit `src/config/project.config.ts` to change homepage content, and `src/content/docs/docs/` to update the docs. Change `src/config/branding.ts` for the site name and toolbar color. Set `SITE_URL` when deploying.

## Test and build

```bash
pnpm lint
pnpm check
pnpm build
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

## Publishing

Configure your deployment provider's Git integration and `SITE_URL`. Run `pnpm install` and commit its newly generated lockfile before changing CI installs back to `--frozen-lockfile`. The source template's build commands are retained; the new quality workflow checks `/` and `/docs/` after static build. See `/docs/deployment/` for deployment checks.

## Provenance

Keep the original MIT `LICENSE` and preserve attribution. This is a fork customization; it is not affiliated with the upstream theme developer.

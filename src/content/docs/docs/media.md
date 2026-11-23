---
title: Screenshots and video
description: Reproducible Playwright website screenshots and VHS CLI terminal screenshots/videos.
---

## What gets captured

Playwright opens a **locally built production preview**, not a third-party website. VHS independently records terminal commands from a checked-in tape.

| File | Description |
| --- | --- |
| `screenshots/home-desktop.png` | Full-page homepage, 1440px viewport |
| `screenshots/home-mobile.png` | Full-page homepage, 390px viewport |
| `screenshots/docs-desktop.png` | Starlight docs, desktop |
| `screenshots/docs-mobile.png` | Starlight docs, mobile |
| `videos/walkthrough.webm` | Playwright's raw browser recording |
| `videos/walkthrough.mp4` | H.264 MP4 encoded by FFmpeg |
| `vhs/quickstart.png` | **VHS CLI** terminal screenshot (PNG) |
| `vhs/quickstart.gif` | **VHS CLI** terminal animation (GIF) |
| `vhs/quickstart.mp4` | **VHS CLI** terminal video (MP4) |

## Run locally

Build the site and run a preview server in one terminal:

```bash
pnpm build
pnpm preview --host 127.0.0.1 --port 4321
```

In another terminal:

```bash
pnpm exec playwright install chromium
pnpm media:capture
pnpm media:video
pnpm media:vhs       # native VHS, ttyd, and ffmpeg; or auto-fallback to Docker
# Alternatively, force the official container:
pnpm media:vhs --docker
```

FFmpeg must be installed locally for the Playwright MP4 conversion.

## Capturing screenshots with VHS CLI

[VHS](https://github.com/charmbracelet/vhs) is a **terminal** screen recorder. A checked-in [tape file](https://github.com/charmbracelet/vhs) (`scripts/media/tapes/quickstart.tape`) types commands in a terminal, then uses `Screenshot media-output/vhs/quickstart.png` to save a still frame. `Output` generates a GIF and an MP4 from the same tape.

Install **VHS**, **ttyd** and **FFmpeg**, then run `pnpm media:vhs`, or use the official pinned container with `pnpm media:vhs --docker` (requires Docker). VHS cannot capture a rendered browser page: for homepage and docs PNGs, use `pnpm media:capture` (Playwright). You can run all three outputs with `pnpm media:all --docker` while the preview server is running.

Make terminal demo edits in the `.tape` file, not in generated assets. Outputs are written to `media-output/`, which is gitignored.

## GitHub Actions

The `.github/workflows/visual-media.yml` workflow runs on pushes to `main`, pull requests, a weekly schedule, and manually via **Actions → Visual media → Run workflow**.

Each run builds the static site, starts the preview server, captures screenshots, records the browser video, converts it to MP4, executes the VHS tape in its official Docker image, and uploads a **visual-media** artifact. You can download the artifact from the run's summary page. The workflow has read-only repository permissions and never pushes generated media into Git automatically.

## Capture controls

- `PLAYWRIGHT_BASE_URL` can point at an alternative server (defaults to `http://127.0.0.1:4321`).
- The browser context fixes viewport size, color mode, animation preferences, and device scale for repeatable output.
- The script waits for fonts and captures only after the page settles.
- The VHS tape uses a fixed 1100 × 600 terminal and writes PNG/GIF/MP4 outputs independently of the preview server.
- The video script scrolls through `#features`, `#workflow`, `#media`, then returns to the top. Adjust these selectors if your homepage sections change.

Add voiceover in post-production if needed; the generated video is silent and includes no copyrighted music.

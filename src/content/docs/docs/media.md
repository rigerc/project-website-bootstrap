---
title: Screenshots and video
description: Website, terminal, and Android app screenshots and video recordings.
sidebar:
  order: 4
  label: Screenshots & video
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
pnpm preview --host 127.0.0.1 --port 4321 --strictPort
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

## Capture an Android app

Install [Android SDK Platform Tools](https://developer.android.com/tools/releases/platform-tools) and make sure `adb` is on `PATH`. Start an emulator or authorize USB debugging on a connected device. Open your Flutter or other Android app and navigate to the screen you want to capture. Run the capture commands from the website directory.

```bash
adb devices
pnpm media:android screenshot --name home
pnpm media:android record --name walkthrough --seconds 20
```

- Select a device with `--serial emulator-5554` or `ANDROID_SERIAL` when several devices are ready. The command automatically selects a sole ready device.
- Pass `--package com.example.app` to check which app has focus before starting capture.
- Screenshots and recordings are saved as `media-output/android/<name>.png` and `media-output/android/<name>.mp4`. A successful capture replaces an earlier file with the same name.
- Recordings default to 20 seconds and accept 1–180 seconds. They capture the display without audio. Keep the orientation fixed and use demo data for any media you intend to share. Press Ctrl+C to cancel a capture.

For repeatable demos, have your app's own script prepare its state and call `screenshot` at each named checkpoint. Start `record` alongside the steps you want to show. Flutter projects can reuse a demo build, app deep links, or an [integration test](https://docs.flutter.dev/cookbook/testing/integration/introduction). The app project controls the build, device profile, and interactions.

### Run Android capture in CI

For an on-demand workflow, use `workflow_dispatch` and add these steps after checkout, Node and pnpm setup, and Android device/app setup. Reuse an existing connected emulator and APK when available. A dedicated capture job only needs one emulator profile and the demo APK. Replace the script path with your app's capture script. Run that script from the website directory or have it invoke `pnpm --dir website media:android` from the app repository root.

```yaml
- name: Capture the Android demo
  run: ./scripts/capture-android-demo.sh
- uses: actions/upload-artifact@v5
  with:
    name: android-media
    path: media-output/android/
    if-no-files-found: error
```

Set the upload path to `website/media-output/android/` if the site lives under `website/`. The template's Visual media workflow continues to capture the website and terminal demos on its own schedule.

## GitHub Actions

The `.github/workflows/visual-media.yml` workflow runs when a release is published and manually via **Actions → Visual media → Run workflow**.

Each run builds the static site, starts the preview server, captures screenshots, records the browser video, converts it to MP4, executes the VHS tape in its official Docker image, and uploads a **visual-media** artifact. You can download the artifact from the run's summary page. The workflow has read-only repository permissions and never pushes generated media into Git automatically.

## Capture controls

- `PLAYWRIGHT_BASE_URL` can point at an alternative server (defaults to `http://127.0.0.1:4321`).
- Before capturing, the scripts fetch the home page and fail unless its title contains the project name. This catches another app already holding port 4321 while Astro's preview quietly moves to the next free port; `--strictPort` makes the preview fail instead of moving.
- The browser context fixes viewport size, color mode, animation preferences, and device scale for repeatable output.
- The script waits for fonts and captures only after the page settles.
- The VHS tape (`scripts/media/tapes/quickstart.tape`) is a template: `pnpm media:vhs` fills in the project name and eyebrow from `src/config/project.config.ts` and records the result. Edit the commands in the template to show your own CLI.
- The VHS tape uses a fixed 1100 × 600 terminal and writes PNG/GIF/MP4 outputs independently of the preview server.
- The video script scrolls through `#features`, `#workflow`, `#media`, then returns to the top. Adjust these selectors if your homepage sections change.

Add voiceover in post-production if needed; the generated video is silent and includes no copyrighted music.

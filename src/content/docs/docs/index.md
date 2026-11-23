---
title: Project documentation
description: Overview and routes for the single-project website.
---

Welcome to the documentation for **Your Project**. This site has one public product landing page at `/` and one documentation area under `/docs/`.

## Start here

- [Getting started](/docs/getting-started/) — install the fork, change the product identity, and run the site locally.
- [Configuration](/docs/configuration/) — update project copy, URLs, metadata, and navigation.
- [Screenshots and video](/docs/media/) — generate repeatable website and terminal assets with Playwright, FFmpeg, and VHS.
- [Deployment](/docs/deployment/) — ship the static pages and docs together.

## Architecture

The landing page reuses Astro Rocket's layouts, components, fonts, and design tokens. Starlight owns the documentation routes, its sidebar, and documentation search. Playwright uses the built site to generate media, while GitHub Actions stores the captures as downloadable run artifacts.

> Replace the placeholder `Your Project` throughout the docs when configuring this fork.

---
title: Project documentation
description: Overview and routes for the single-project website.
sidebar:
  order: 1
  label: Overview
---

Welcome to the documentation for **Your Project**. This site has one public product landing page at `/` and one documentation area under `/docs/`.

## Start here

- [Getting started](./getting-started/) — install the fork, change the product identity, and run the site locally.
- [Add to an existing project](./integrate/) — put the site in a subdirectory and publish it with your existing releases.
- [Configuration](./configuration/) — update project copy, URLs, metadata, and navigation.
- [Screenshots and video](./media/) — generate repeatable website and terminal assets with Playwright, FFmpeg, and VHS.
- [Deployment](./deployment/) — ship the static pages and docs together.

## Architecture

The landing page reuses Astro Rocket's layouts, components, fonts, and design tokens. Starlight owns the documentation routes, its sidebar, and documentation search. Playwright uses the built site to generate media, while GitHub Actions stores the captures as downloadable run artifacts.

> Replace the placeholder `Your Project` throughout the docs when configuring this fork.

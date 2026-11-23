/** Single source of truth for the one project this site presents. */
export const project = {
  name: 'Your Project',
  eyebrow: 'ONE PROJECT. ONE CLEAR STORY.',
  headline: 'A focused home for your next big idea.',
  summary:
    'Explain what your product does, show the experience, and help people get started—all in one place.',
  description:
    'A single-project website with documentation, release-ready screenshots, and automated demo videos.',
  repository: 'https://github.com/YOUR_USERNAME/YOUR_PROJECT',
  // Leave empty until there is a real deployment. The UI hides the link if empty.
  demoUrl: '',
  installCommand: 'pnpm install && pnpm dev',
  versionLabel: 'Open source',
  benefits: [
    { number: '01', icon: 'layout-template', title: 'One destination', description: 'Keep the story, feature details, and next steps focused on one project—not a portfolio of unrelated work.' },
    { number: '02', icon: 'book-open', title: 'Documentation that scales', description: 'Guides and reference pages live under /docs, powered by Astro Starlight.' },
    { number: '03', icon: 'camera', title: 'Media on every release', description: 'Repeatable Playwright screenshots, browser walkthroughs, and VHS terminal captures run in GitHub Actions.' },
  ],
  steps: [
    { label: 'Discover', detail: 'Understand the problem and how the project solves it.' },
    { label: 'Explore', detail: 'See the product experience at desktop and mobile sizes.' },
    { label: 'Build', detail: 'Follow the quick-start guide and configuration reference.' },
  ],
  faqs: [
    { question: 'Where should I start?', answer: 'Read the quick-start guide for setup, commands, and the first changes to make.' },
    { question: 'Where do screenshots and videos come from?', answer: 'Playwright captures website screenshots and a walkthrough; VHS captures terminal screenshots, GIFs, and MP4 video. GitHub Actions uploads every file as an artifact.' },
    { question: 'How do I customize the site?', answer: 'Start with src/config/project.config.ts for page copy and links, then edit src/content/docs/docs/ for documentation.' },
  ],
} as const;

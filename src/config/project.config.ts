/**
 * Single source of truth for the one project this site presents.
 *
 * - `name` and `accentColor` feed the header, favicon, social cards, docs and
 *   homepage (`branding.ts` re-exports them for build-time code).
 * - `hero` is the top of the homepage.
 * - `sections` are rendered in order below the hero. Reorder, remove or repeat
 *   them freely; a section with `nav` also appears in the header navigation.
 *
 * Headings: `\n` starts a new line, and `*text*` renders that part in the
 * accent colour. Internal links (`/docs/...`, `/#faq`) get the deploy's base
 * path added automatically; full URLs are left alone. An action or link with
 * an empty `href` is hidden, so placeholders like `demoUrl: ''` are safe.
 */

/** Any icon name accepted by `<Icon>`: a Lucide name (`book-open`) or `brand-*`. */
type IconName = string;

export interface ProjectAction {
  label: string;
  href: string;
  icon?: IconName;
  variant?: 'primary' | 'secondary';
}

export interface ProjectLink {
  label: string;
  href: string;
}

/** A terminal mockup: commands typed, then a status and output lines. */
export interface TerminalVisual {
  type: 'terminal';
  title: string;
  commands: string[];
  status?: string;
  lines?: string[];
  footer?: [string, string];
}

/** A screenshot or artwork in `public/` (e.g. `/screenshots/app.png`) or a full URL. */
export interface ImageVisual {
  type: 'image';
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

/** A self-hosted video in `public/`, with playback controls. */
export interface VideoVisual {
  type: 'video';
  src: string;
  /** Text equivalent for screen readers. */
  alt: string;
  poster?: string;
}

interface SectionBase {
  /** Anchor id, so `/#<id>` links to the section. */
  id: string;
  /** Header navigation label. Omit to keep the section out of the nav. */
  nav?: string;
  kicker?: string;
  heading: string;
  lead?: string;
  /** Muted background, to separate neighbouring sections. */
  alt?: boolean;
}

export interface FeaturesSection extends SectionBase {
  type: 'features';
  items: { icon: IconName; title: string; description: string }[];
}

export interface StepsSection extends SectionBase {
  type: 'steps';
  link?: ProjectLink;
  items: { label: string; detail: string }[];
}

/**
 * A grid of screenshots or videos; the first item is shown large. An item with
 * no `image`/`video` shows a drawn placeholder (`placeholder`) until you have
 * a real capture, e.g. one from `pnpm media:capture`, copied into `public/`.
 */
export interface MediaSection extends SectionBase {
  type: 'media';
  caption?: string;
  link?: ProjectLink;
  items: {
    label: string;
    /** Short detail on the right of the label, e.g. `1440 × 900`. */
    meta?: string;
    icon?: IconName;
    image?: Omit<ImageVisual, 'type'>;
    video?: Omit<VideoVisual, 'type'>;
    placeholder?: 'desktop' | 'mobile' | 'video';
  }[];
}

export interface FaqSection extends SectionBase {
  type: 'faq';
  items: { question: string; answer: string }[];
}

export interface CtaSection extends SectionBase {
  type: 'cta';
  actions: ProjectAction[];
}

export type ProjectSection = FeaturesSection | StepsSection | MediaSection | FaqSection | CtaSection;

export function hasSectionContent(section: ProjectSection): boolean {
  return !('items' in section) || section.items.length > 0;
}

export interface ProjectConfig {
  name: string;
  /** Short description for search results, social cards and the docs. */
  description: string;
  /** Brand colour (hex). Tints the homepage, header, docs, favicon and social cards. */
  accentColor: `#${string}`;
  repository: string;
  /** Live demo or app URL. Leave empty until there is one; the button hides itself. */
  demoUrl: string;
  hero: {
    eyebrow?: string;
    headline: string;
    summary: string;
    actions: ProjectAction[];
    /** Short facts under the buttons, separated by slashes. */
    meta?: string[];
    visual?: TerminalVisual | ImageVisual | VideoVisual;
    /** Two small labels along the bottom edge of the hero. */
    footer?: string[];
  };
  sections: ProjectSection[];
}

const repository = 'https://github.com/YOUR_USERNAME/YOUR_PROJECT';
const demoUrl = '';

export const project: ProjectConfig = {
  name: 'Your Project',
  description:
    'A single-project website with documentation, release-ready screenshots, and automated demo videos.',
  accentColor: '#7a79ff',
  repository,
  demoUrl,

  hero: {
    eyebrow: 'ONE PROJECT. ONE CLEAR STORY.',
    headline: 'A focused home for your next big idea.',
    summary:
      'Explain what your product does, show the experience, and help people get started—all in one place.',
    actions: [
      { label: 'Get started', href: '/docs/getting-started/', icon: 'arrow-up-right', variant: 'primary' },
      { label: 'View source', href: repository, icon: 'github', variant: 'secondary' },
    ],
    meta: ['Open source', 'Built on Astro Rocket', 'Docs by Starlight'],
    // Swap for { type: 'image', src: '/screenshots/home.png', alt: '…' } to show a screenshot.
    visual: {
      type: 'terminal',
      title: 'your-project / terminal',
      commands: [
        ...(repository ? [`git clone ${repository}`] : []),
        'pnpm install && pnpm dev',
      ],
      status: 'PROJECT READY',
      lines: ['A single product website.', 'Documentation under /docs.', 'Screenshots + demo video in CI.'],
      footer: ['Production-friendly foundation', 'Astro · Starlight · Playwright'],
    },
    footer: ['BUILT FOR CLARITY', '01 / OVERVIEW'],
  },

  sections: [
    {
      type: 'features',
      id: 'features',
      nav: 'Features',
      kicker: 'THE FOUNDATION',
      heading: 'Everything important.\n*Nothing distracting.*',
      lead: 'One homepage, one documentation system, and one reproducible media pipeline. Customize each without reinventing the surrounding infrastructure.',
      items: [
        { icon: 'layout-template', title: 'One destination', description: 'Keep the story, feature details, and next steps focused on one project—not a portfolio of unrelated work.' },
        { icon: 'book-open', title: 'Documentation that scales', description: 'Guides and reference pages live under /docs, powered by Astro Starlight.' },
        { icon: 'camera', title: 'Media on every release', description: 'Repeatable Playwright screenshots, browser walkthroughs, and VHS terminal captures run in GitHub Actions.' },
      ],
    },
    {
      type: 'steps',
      id: 'workflow',
      nav: 'Workflow',
      alt: true,
      kicker: 'HOW IT WORKS',
      heading: 'From first look\nto first commit.',
      lead: "Give visitors a deliberate journey: understand what you're building, explore the experience, and follow a documented path to adoption.",
      link: { label: 'Explore the docs', href: '/docs/' },
      items: [
        { label: 'Discover', detail: 'Understand the problem and how the project solves it.' },
        { label: 'Explore', detail: 'See the product experience at desktop and mobile sizes.' },
        { label: 'Build', detail: 'Follow the quick-start guide and configuration reference.' },
      ],
    },
    {
      type: 'media',
      id: 'media',
      nav: 'Media',
      kicker: 'PROVE IT VISUALLY',
      heading: 'A capture pipeline,\n*not a manual chore.*',
      lead: 'Every run can produce a desktop screenshot, mobile screenshot, documentation screenshot, and a browser-recorded MP4 demo, plus VHS-powered terminal PNG/GIF/MP4 recordings.',
      caption: 'These are design previews. Replace them with real captures from the Visual media workflow.',
      link: { label: 'Media workflow docs', href: '/docs/media/' },
      items: [
        { label: 'DESKTOP CAPTURE', meta: '1440 × 900', icon: 'monitor', placeholder: 'desktop' },
        { label: 'MOBILE', meta: '390 × 844', icon: 'smartphone', placeholder: 'mobile' },
        { label: 'VIDEO', meta: 'MP4', icon: 'clapperboard', placeholder: 'video' },
      ],
    },
    {
      type: 'faq',
      id: 'faq',
      alt: true,
      kicker: 'QUESTIONS',
      heading: 'Good to know.',
      lead: 'Short answers. Deeper instructions in the docs.',
      items: [
        { question: 'Where should I start?', answer: 'Read the quick-start guide for setup, commands, and the first changes to make.' },
        { question: 'Where do screenshots and videos come from?', answer: 'Playwright captures website screenshots and a walkthrough; VHS captures terminal screenshots, GIFs, and MP4 video. GitHub Actions uploads every file as an artifact.' },
        { question: 'How do I customize the site?', answer: 'Start with src/config/project.config.ts for page copy, sections, links and colour, then edit src/content/docs/docs/ for documentation.' },
      ],
    },
    {
      type: 'cta',
      id: 'get-started',
      kicker: 'MAKE IT YOURS',
      heading: 'One project deserves\na great first impression.',
      lead: 'Edit the project configuration, publish your docs, and generate the media your visitors need.',
      actions: [
        { label: 'Read the quick start', href: '/docs/getting-started/', icon: 'arrow-up-right', variant: 'primary' },
        { label: 'Open live demo', href: demoUrl, icon: 'external-link', variant: 'secondary' },
      ],
    },
  ],
};

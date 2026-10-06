import type { AngularStory } from './stories'

/** Story cards for the link Angular demo (titles + descriptions mirror demos/react/link.tsx). */
export const stories: AngularStory[] = [
  {
    title: 'Inline in body copy',
    description: "Links flow naturally inside a paragraph — the most common place you'll reach for this component.",
  },
  {
    title: 'Color & underline',
    description:
      'Three color tones paired with the three underline modes, so you can pick the right emphasis for the surrounding text.',
  },
  {
    title: 'Sizes',
    description: 'sm, default, and lg for matching the surrounding text scale.',
  },
  {
    title: 'With icons',
    description:
      "Left and right slots for leading and trailing icons — trailing is common for external links and 'continue' affordances.",
  },
  {
    title: 'External vs internal',
    description:
      'http(s) hrefs auto-open in a new tab with rel=noopener. Pass external={false} to force same-tab, or use a relative href.',
  },
  {
    title: 'Disabled',
    description: 'Non-interactive links are dimmed and ignore pointer events.',
  },
  {
    title: 'In a card footer',
    description: 'A realistic placement — a help card that links to docs, support, and an external status page.',
  },
  {
    title: 'AsChild',
    description: 'Compose full link styling onto a custom element — a button, router-link, or anchor.',
  },
]

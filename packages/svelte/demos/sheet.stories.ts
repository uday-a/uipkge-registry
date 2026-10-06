import type { SvelteStory } from '../../lib/svelte-stories'

export const stories: SvelteStory[] = [
  {
    title: 'Default (left)',
    description: 'Side panel anchored to the left edge with header, body fields, and footer action.',
  },
  {
    title: 'Right (default drawer)',
    description: 'The most common drawer position — slides in from the trailing edge.',
  },
  {
    title: 'Top',
    description: 'Slides down from the top edge — good for site-wide notifications or banners.',
  },
  {
    title: 'Bottom (mobile pattern)',
    description: 'Slides up from the bottom edge — the canonical mobile bottom-sheet.',
  },
  {
    title: 'Long scrollable content',
    description: 'The body region scrolls independently when content overflows the panel height.',
  },
]

import type { AngularStory } from './stories'

/** Story cards for the sheet Angular demo (titles + descriptions mirror demos/react/sheet.tsx). */
export const stories: AngularStory[] = [
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

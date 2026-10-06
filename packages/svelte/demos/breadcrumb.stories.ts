import type { SvelteStory } from '../../lib/svelte-stories'

export const stories: SvelteStory[] = [
  {
    title: 'Default',
    description: 'Links + a final non-link page entry. BreadcrumbSeparator auto-renders a chevron between items.',
  },
  {
    title: 'With leading icon',
    description: 'Wrap a Lucide icon in BreadcrumbLink for an iconic Home root.',
  },
  {
    title: 'Custom separator',
    description: 'Slot any node into BreadcrumbSeparator to override the default chevron — slash, dot, or anything else.',
  },
  {
    title: 'Long path with ellipsis',
    description: 'Use BreadcrumbEllipsis to collapse middle segments visually.',
  },
  {
    title: 'Responsive truncation',
    description: 'Combine hidden / md:inline classes to drop interior segments on small screens — try resizing.',
  },
]

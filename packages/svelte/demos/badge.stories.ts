import type { SvelteStory } from '../../lib/svelte-stories'

export const stories: SvelteStory[] = [
  {
    title: 'Variants',
    description:
      'Seven visual styles. default + secondary for neutral pills; outline for subtle chips; destructive / success / warning / info for tone.',
  },
  { title: 'With icon', description: 'Combine with lucide icons for status pills.' },
  { title: 'In context', description: 'Inline with text and counts — the most common badge usage.' },
  {
    title: 'Notification dots on icons',
    description: 'Position a small Badge over a button to indicate unread or pending state.',
  },
  {
    title: 'Truncation',
    description:
      'Badges clip long labels. For an ellipsis, wrap the label in a span with truncate — the badge lets it shrink.',
  },
  {
    title: 'Wrapped labels',
    description:
      'Use wrap to let long labels flow onto multiple lines instead of clipping. Geometry switches to rounded-lg so the pill stays readable.',
  },
  {
    title: 'Sizes via class override',
    description:
      'Badge ships one size — use Tailwind utilities to scale up or down for hero or list-density placements.',
  },
]

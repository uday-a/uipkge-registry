import type { SvelteStory } from '../../lib/svelte-stories'

export const stories: SvelteStory[] = [
  {
    title: 'With form fields',
    description: 'Click the trigger to open. PopoverContent floats above the page and moves focus into the panel.',
  },
  {
    title: 'Compact info',
    description: 'Use a smaller width for short summaries — session info, account hover, etc.',
  },
  {
    title: 'Sides + alignment',
    description: 'side controls top / right / bottom / left; align controls start / center / end along that side.',
  },
  { title: 'Filter chips', description: 'Common pattern — an icon trigger that opens a panel of filter controls.' },
  {
    title: 'Icon-only quick actions',
    description: 'Each row-action button can open a contextual popover for delete-confirm, share-options, etc.',
  },
  {
    title: 'Controlled with bind:open',
    description:
      'Drive open state externally for programmatic open / close (form submission, keyboard shortcut, etc.).',
  },
  {
    title: 'Persistent (localStorage)',
    description: 'Pass persist as a key. The open state survives page reload.',
  },
  {
    title: 'Close behavior - manual',
    description: 'closeBehavior="manual" ignores click-outside and Escape. Use a Close button.',
  },
  {
    title: 'Close behavior - click-outside only',
    description: 'Escape is suppressed; clicking outside still closes.',
  },
]

import type { AngularStory } from './types'

export const stories: AngularStory[] = [
  {
    title: 'Activity feed',
    description: 'A realistic notification feed that loads more pages as you scroll the page downward.',
  },
  {
    title: 'Custom loading & end slots',
    description: 'Replace the default spinner with branded text, and show a custom end message when data runs out.',
  },
  {
    title: 'Chat timeline (reverse)',
    description: 'Sentinel at the top; new older messages prepend — the pattern for chat apps loading history upward.',
  },
  {
    title: 'Scrollable container target',
    description:
      'scrollTarget pins the listener to a specific element instead of the window — useful for panels and drawers.',
  },
  {
    title: 'In a card',
    description: 'Infinite scroll embedded in a card with a header — the pattern for dashboards and activity panels.',
  },
]

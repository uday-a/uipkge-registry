import type { StoryMeta } from './types'

export const stories: StoryMeta[] = [
  {
    title: 'Mobile app shell',
    description:
      'A realistic phone frame with a content area that reacts to the active tab. Tap a tab — the active pill slides and the icon gently scales.',
  },
  {
    title: 'Shopping app with badges',
    description: 'Numeric and text badges surface counts that need attention — cart saves, unread inbox, and more.',
  },
  {
    title: 'Custom active color',
    description: 'Override the active item color with a Tailwind class to match your brand — here a violet accent.',
  },
  {
    title: '5 tabs & no indicator',
    description: 'Left: five evenly spaced tabs. Right: the active pill hidden for a flatter, more minimal look.',
  },
  {
    title: 'Long labels on narrow screens',
    description: 'Labels truncate gracefully when space is tight — the worst case for a 200px-wide device.',
  },
  {
    title: 'Router integration',
    description:
      'Items carry a `to` prop for link integration — the component renders an anchor that navigates when a tab is selected.',
  },
]

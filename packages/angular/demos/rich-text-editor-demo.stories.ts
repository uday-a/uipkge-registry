import type { AngularStory } from './types'

export const stories: AngularStory[] = [
  {
    title: 'Empty with placeholder',
    description: 'No initial content — placeholder text shows until the user starts typing.',
  },
  {
    title: 'Pre-filled content',
    description: 'Initial HTML rendered into the editor — try selecting text and toggling the toolbar.',
  },
  {
    title: 'Custom min-height',
    description: 'Taller editor surface for long-form content.',
  },
  {
    title: 'Side-by-side editing',
    description: 'Two independent editor instances — useful for translations or before/after diffs.',
  },
]

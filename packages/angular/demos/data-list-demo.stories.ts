import type { AngularStory } from './stories'

/** Story cards for the data-list Angular demo (titles + descriptions mirror demos/react/data-list.tsx). */
export const stories: AngularStory[] = [
  {
    title: 'Default',
    description: 'Key/value rows inside a card with mixed text and badge values.',
  },
  {
    title: 'Multi-column grid',
    description: 'Three-column responsive grid of label/value pairs for compact summaries.',
  },
  {
    title: 'With chips and badges',
    description: 'Values rendered as status badges and feature chips.',
  },
  {
    title: 'In a card with header',
    description: 'DataList paired with a Card header for a labeled detail panel.',
  },
]

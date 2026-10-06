import type { AngularStory } from './stories'

/** Story cards for the scroll-area Angular demo (titles + order mirror demos/react/scroll-area.tsx). */
export const stories: AngularStory[] = [
  { title: 'Default', description: 'Fixed-height container with a styled scrollbar for overflowing content.' },
  {
    title: 'Horizontal scroll',
    description: 'Long row of cards. Add a horizontal ScrollBar and let inline content overflow on the x-axis.',
  },
  {
    title: 'Both axes',
    description: 'Large grid that overflows on both axes — vertical and horizontal scrollbars combine.',
  },
  {
    title: 'Inside a card',
    description: 'Constrain a card body to a fixed height and make only the inner list scrollable.',
  },
]

import type { AngularStory } from './stories'

/** Story cards for the waffle-chart Angular demo (titles mirror the React demo). */
export const stories: AngularStory[] = [
  {
    title: 'Traffic share',
    description: 'Each cell is 1%; legend carries the exact shares.',
  },
  {
    title: 'Survey result',
    description: 'No legend for pictogram-style tiles.',
  },
]

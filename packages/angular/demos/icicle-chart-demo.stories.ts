import type { AngularStory } from './stories'

/** Story cards for the icicle-chart Angular demo (titles mirror the React demo). */
export const stories: AngularStory[] = [
  {
    title: 'Volume by trade lane',
    description: 'Top-down partition: region, then lane. Width is tonnage.',
  },
  {
    title: 'Capacity by alliance',
    description: 'Same shape for carrier splits — colour follows the top-level branch.',
  },
]

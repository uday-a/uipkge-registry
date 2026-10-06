import type { AngularStory } from './stories'

/** Story cards for the waterfall-chart Angular demo (titles mirror the React demo). */
export const stories: AngularStory[] = [
  {
    title: 'Cashflow waterfall',
    description: 'Signed deltas accumulate. Positives teal, negatives orange, Total computed.',
  },
  {
    title: 'Without total',
    description: 'Hide the computed Total bar when you only want the walk.',
  },
  {
    title: 'Compact',
    description: 'Shorter frame for dashboard tiles.',
  },
]

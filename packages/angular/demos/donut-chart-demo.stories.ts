import type { AngularStory } from './stories'

/** Story cards for the donut-chart Angular demo (titles mirror the React demo). */
export const stories: AngularStory[] = [
  {
    title: 'Revenue split',
    description: 'Full ring with rounded segments and a centre total.',
  },
  {
    title: 'Filled donut',
    description: 'Thickness 0 collapses the ring into a pie.',
  },
  {
    title: 'Half donut',
    description: 'Semicircle gauge with the total tucked under the arc.',
  },
  {
    title: 'KPI ring',
    description: 'Custom centre label for goal tracking.',
  },
]

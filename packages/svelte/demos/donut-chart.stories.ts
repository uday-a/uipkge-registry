import type { SvelteStory } from '../../lib/svelte-stories'

export const stories: SvelteStory[] = [
  {
    title: 'Revenue split',
    description: 'Full ring with rounded segments and a centre total.',
  },
  {
    title: 'Device share',
    description: 'Percentages compute into the tooltip automatically.',
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

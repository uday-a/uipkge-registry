import type { AngularStory } from './stories'

/** Story cards for the beeswarm-chart Angular demo (mirrors demos/react/beeswarm-chart.tsx). */
export const stories: AngularStory[] = [
  {
    title: 'Default',
    description: 'One dot per observation; jitter is deterministic so SSR matches.',
  },
]

import type { SvelteStory } from '../../lib/svelte-stories'

export const stories: SvelteStory[] = [
  { title: 'Basic line', description: 'Smooth single series with point markers.' },
  { title: 'Multi-series', description: 'Two series with an auto legend from the y fields.' },
  { title: 'Smooth, no markers', description: 'Clean curve for dense data.' },
  { title: 'Stepped', description: 'Step interpolation for values that change discretely.' },
  { title: 'Dashed forecast', description: 'Dashed stroke for projected data.' },
  { title: 'Stacked lines', description: 'Cumulative stacking across series.' },
]

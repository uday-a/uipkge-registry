import type { SvelteStory } from '../../lib/svelte-stories'

export const stories: SvelteStory[] = [
  {
    title: 'Healthy quarter',
    description: '90 daily bars; uptime % computes from the data.',
  },
  {
    title: 'With incidents',
    description: 'Degraded stretches and a full outage day. Hover any bar for its date.',
  },
  {
    title: 'Compact',
    description: 'Hide the legend for status-page grids.',
  },
]

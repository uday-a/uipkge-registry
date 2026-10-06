import type { SvelteStory } from '../../lib/svelte-stories'

export const stories: SvelteStory[] = [
  {
    title: 'Scores by team',
    description: 'One dot per observation; jitter is deterministic so SSR matches.',
  },
  { title: 'Latency sample', description: 'Single-group strip for raw distributions.' },
]

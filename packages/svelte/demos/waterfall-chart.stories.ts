import type { SvelteStory } from '../../lib/svelte-stories'

export const stories: SvelteStory[] = [
  {
    title: 'Cashflow waterfall',
    description: 'Signed deltas accumulate. Positives teal, negatives orange, Total computed.',
  },
  { title: 'Without total', description: 'Hide the computed Total bar when you only want the walk.' },
  { title: 'P&L bridge', description: 'Zero deltas render as flat steps — useful for subtotal rows.' },
  { title: 'Compact', description: 'Shorter frame for dashboard tiles. Labels stay on top.' },
]

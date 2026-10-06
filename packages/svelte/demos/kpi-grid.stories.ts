import type { SvelteStory } from '../../lib/svelte-stories'

export const stories: SvelteStory[] = [
  {
    title: 'Default — four explicit tiles',
    description:
      'KpiGrid is just a responsive grid container (2 / 3 / 4 columns). You compose each tile inline so the call-site reads top-to-bottom with no hidden item rendering.',
  },
  {
    title: 'Three columns',
    description: 'Use the columns prop to change density. Accepts 2, 3, or 4.',
  },
  { title: 'Two columns', description: 'Two-up layout for hero metrics.' },
]

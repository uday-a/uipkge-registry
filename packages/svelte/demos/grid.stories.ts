import type { SvelteStory } from '../../lib/svelte-stories'

export const stories: SvelteStory[] = [
  { title: '3 columns', description: 'Three-column grid with a small gap.' },
  { title: '4 columns', description: 'Four-column grid with a larger gap.' },
  {
    title: 'Responsive',
    description:
      'Pass a breakpoint map for a layout that adapts: 1 column on phones, 2 on small tablets, 4 on desktop.',
  },
]

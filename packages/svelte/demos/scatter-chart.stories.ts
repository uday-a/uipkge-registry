import type { SvelteStory } from '../../lib/svelte-stories'

export const stories: SvelteStory[] = [
  { title: 'Single series', description: 'Plain x/y scatter with themed axes and tooltip.' },
  { title: 'Bubble sizing', description: 'Point area scales with the size field.' },
  { title: 'Categorized', description: 'One series + legend entry per category value.' },
]

import type { SvelteStory } from '../../lib/svelte-stories'

export const stories: SvelteStory[] = [
  {
    title: 'API response',
    description: 'Nested objects, arrays, and primitives with search and click-to-copy.',
  },
  { title: 'Error payload', description: 'A validation error with a custom root label.' },
  { title: 'Expanded deep', description: 'expandDepth={4} opens the tree four levels on mount.' },
  { title: 'No toolbar', description: 'Hide the search and expand/collapse controls for a bare tree.' },
]

import type { SvelteStory } from '../../lib/svelte-stories'

export const stories: SvelteStory[] = [
  { title: 'Default', description: 'Free-text input that converts entries into removable tag chips.' },
  { title: 'Add on paste', description: 'Pasting splits on whitespace and adds each token as a tag.' },
  { title: 'Custom delimiter', description: 'Use the delimiter prop to split on commas instead of Enter.' },
  { title: 'Max length', description: 'Cap the total number of tags via the max prop.' },
  { title: 'Disabled', description: 'Disabled state blocks the input and prevents tag removal.' },
]

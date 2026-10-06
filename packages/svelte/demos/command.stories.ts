import type { SvelteStory } from '../../lib/svelte-stories'

export const stories: SvelteStory[] = [
  { title: 'Default', description: 'Search input with a grouped suggestion list and an empty state.' },
  { title: 'With shortcuts', description: 'Trailing keyboard hints per item.' },
  { title: 'Multiple groups + separator', description: 'Two headed groups divided by a separator.' },
  { title: 'CommandDialog (modal)', description: 'The palette mounted in a dialog, opened from a button.' },
  { title: 'Loading & empty state', description: 'Async-feel loading row before results arrive.' },
]

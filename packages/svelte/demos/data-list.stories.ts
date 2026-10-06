import type { SvelteStory } from '../../lib/svelte-stories'

export const stories: SvelteStory[] = [
  { title: 'Default', description: 'Label/value rows for read-only metadata such as invoice details.' },
  { title: 'Multi-column grid', description: 'Override the row layout with a grid for three-column rows.' },
  { title: 'With chips and badges', description: 'Trailing status pills, roles, and flags per row.' },
  { title: 'In a card with header', description: 'A data list inside a bordered card with a header section.' },
]

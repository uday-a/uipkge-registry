import type { SvelteStory } from '../../lib/svelte-stories'

export const stories: SvelteStory[] = [
  { title: 'Default', description: 'Dot markers with title, date, and description.' },
  { title: 'Icon markers', description: 'Icon variant tinted by status.' },
  { title: 'Status colors', description: 'Colored connectors follow the item status.' },
  { title: 'Alternating sides', description: 'Center-aligned items alternate left and right.' },
  { title: 'Horizontal', description: 'Left-to-right progression layout.' },
  { title: 'Compact density', description: 'Tight spacing for activity feeds.' },
]

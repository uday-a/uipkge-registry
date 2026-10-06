import type { SvelteStory } from '../../lib/svelte-stories'

export const stories: SvelteStory[] = [
  { title: 'Default', description: 'Plain rows for menus and option lists.' },
  { title: 'With subheaders', description: 'Uppercase group labels between sections.' },
  { title: 'Active state', description: 'Highlight the current selection; hover affordances on clickables.' },
  { title: 'Disabled state', description: 'Dimmed rows that skip hover and tab order.' },
  { title: 'Anchor links', description: 'Items rendered as anchors get interactive styles for free.' },
  {
    title: 'Structured item rows',
    description: 'Media + title/description + trailing action composition for settings lists.',
  },
]

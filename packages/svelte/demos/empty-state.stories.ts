import type { SvelteStory } from '../../lib/svelte-stories'

export const stories: SvelteStory[] = [
  {
    title: 'Default',
    description: 'Centered icon, title, description, and a single primary action.',
  },
  {
    title: 'Without action',
    description: 'Icon, title, and description only — no slot content.',
  },
  {
    title: 'With multiple actions',
    description: 'Primary plus secondary action stacked horizontally below the description.',
  },
  {
    title: 'Different scenarios',
    description: 'Same component reused for no-data, error, and filtered-out states — only icon and copy change.',
  },
]

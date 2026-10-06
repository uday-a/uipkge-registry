import type { SvelteStory } from '../../lib/svelte-stories'

export const stories: SvelteStory[] = [
  { title: 'Default', description: 'Two-way bound boolean. Click toggles the state.' },
  { title: 'States', description: 'On / off / disabled / disabled-on combinations.' },
  { title: 'With text', description: 'Checked and unchecked text labels inside the track.' },
  { title: 'With icons', description: 'Snippets for checked and unchecked children support icons.' },
  { title: 'Loading', description: 'Loading state shows a spinner and disables interaction.' },
  { title: 'Sizes', description: 'Three sizes with and without inner labels.' },
  { title: 'Colors', description: 'Custom track colors beyond the default primary.' },
]

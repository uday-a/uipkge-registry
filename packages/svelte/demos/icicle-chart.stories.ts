import type { SvelteStory } from '../../lib/svelte-stories'

export const stories: SvelteStory[] = [
  {
    title: 'Volume by trade lane',
    description: 'Top-down partition: region, then lane. Width is tonnage.',
  },
  {
    title: 'Capacity by alliance',
    description: 'Same shape for carrier splits — colour follows the top-level branch.',
  },
]

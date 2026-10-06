import type { SvelteStory } from '../../lib/svelte-stories'

export const stories: SvelteStory[] = [
  { title: 'Single select', description: 'Pick one value with a sliding indicator.' },
  { title: 'Multiple select', description: 'Toggle independent options on and off.' },
  { title: 'Variants', description: 'Default and outline item chrome.' },
  { title: 'Sizes', description: 'Small, default, and large heights.' },
  { title: 'With spacing', description: 'Gapped items keep their own rounding and borders.' },
  { title: 'Disabled', description: 'The whole group ignores selection.' },
  { title: 'Static (no indicator)', description: 'On-state paints on the item instead of a sliding pill.' },
]

import type { SvelteStory } from '../../lib/svelte-stories'

export const stories: SvelteStory[] = [
  { title: 'Default', description: 'Independent on/off icon button for formatting actions.' },
  { title: 'Variants', description: 'Default has no border; outline adds a visible border and shadow.' },
  { title: 'Sizes', description: 'Small, default, and large heights.' },
  { title: 'With label', description: 'Toggle accepts arbitrary children, including text alongside icons.' },
  { title: 'Controlled', description: 'Bind state with bind:pressed and observe it externally.' },
  { title: 'Disabled', description: 'Non-interactive state respects the current pressed value.' },
]

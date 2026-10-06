import type { SvelteStory } from '../../lib/svelte-stories'

export const stories: SvelteStory[] = [
  {
    title: 'Page navigation',
    description: 'The classic top bar that fills during a route load. Error tints it red.',
  },
  { title: 'Form submission', description: 'A green bar tied to a save action via its own controller.' },
  { title: 'Manual control', description: 'Drive progress directly with bind:value.' },
  { title: 'Indeterminate fetching', description: 'Sliding bar plus spinner for unknown durations.' },
  { title: 'Bottom-anchored bar', description: 'Anchor the bar to the bottom of the viewport.' },
]

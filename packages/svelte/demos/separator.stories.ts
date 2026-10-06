import type { SvelteStory } from '../../lib/svelte-stories'

export const stories: SvelteStory[] = [
  {
    title: 'Horizontal',
    description: "Default orientation. Adds a 1px line spanning the parent's width.",
  },
  {
    title: 'Vertical',
    description: "Use orientation='vertical' inside a flex container with explicit height.",
  },
]

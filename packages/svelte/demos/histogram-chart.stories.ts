import type { SvelteStory } from '../../lib/svelte-stories'

export const stories: SvelteStory[] = [
  { title: 'Auto-binned', description: 'Pass raw values plus a bin count; the peak bin highlights.' },
  { title: 'Pre-binned', description: 'Pass { bin, count } rows when you aggregate server-side.' },
]

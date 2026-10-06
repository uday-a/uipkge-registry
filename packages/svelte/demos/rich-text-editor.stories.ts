import type { SvelteStory } from '../../lib/svelte-stories'

export const stories: SvelteStory[] = [
  { title: 'Empty with placeholder', description: 'Blank editor with a muted placeholder prompt.' },
  { title: 'Pre-filled content', description: 'Controlled value with headings, lists, and a quote.' },
  { title: 'Custom min-height', description: 'Taller editing surface for long-form content.' },
  { title: 'Side-by-side editing', description: 'Two-way bound HTML rendered live beside the editor.' },
]

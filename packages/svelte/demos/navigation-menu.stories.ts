import type { SvelteStory } from '../../lib/svelte-stories'

export const stories: SvelteStory[] = [
  { title: 'Default', description: 'Hover/click triggers with a shared viewport panel.' },
  { title: 'Three-column mega menu', description: 'Rich multi-column content in one panel.' },
  { title: 'Per-item flyouts', description: 'viewport={false} renders each panel under its trigger.' },
  { title: 'With indicator', description: 'Animated arrow tracking the open trigger.' },
]

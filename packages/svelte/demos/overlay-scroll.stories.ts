import type { SvelteStory } from '../../lib/svelte-stories'

export const stories: SvelteStory[] = [
  { title: 'Default', description: 'Auto-fading overlay thumb over a message list.' },
  { title: 'Sidebar nav', description: 'Bounded flex-1 column — the classic sidebar case.' },
  { title: 'Programmatic scroll', description: 'Drive the scroller via the exposed component handle.' },
  { title: 'Dynamic growth', description: 'The thumb shrinks as rows are appended.' },
  { title: 'Non-draggable thumb', description: 'draggable={false} keeps hover/scroll but disables dragging.' },
]

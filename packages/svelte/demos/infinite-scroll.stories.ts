import type { SvelteStory } from '../../lib/svelte-stories'

export const stories: SvelteStory[] = [
  {
    title: 'Feed with load-more',
    description: 'Forward mode inside a scrollable element. Loads 5 pages, then shows the end state.',
  },
  {
    title: 'Reverse chat history',
    description: 'Reverse mode prepends older messages as you scroll toward the top.',
  },
]

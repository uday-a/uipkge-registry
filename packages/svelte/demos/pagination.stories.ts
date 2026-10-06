import type { SvelteStory } from '../../lib/svelte-stories'

export const stories: SvelteStory[] = [
  {
    title: 'Default',
    description: 'Pagination with prev/next, edge pages, ellipses, and an active page indicator.',
  },
  {
    title: 'Compact (no siblings)',
    description: 'siblingCount={0} keeps only the current page between ellipses for a tighter footprint.',
  },
  {
    title: 'Without first/last edges',
    description: 'Drop PaginationFirst and PaginationLast when only ±1 navigation is needed.',
  },
  {
    title: 'With edges (boundary 1)',
    description: 'showEdges keeps the first and last page visible regardless of the current selection.',
  },
  {
    title: 'Many pages with v-model',
    description: 'Two-way bind bind:page to react to page changes outside the component.',
  },
  {
    title: 'Disabled',
    description: 'Setting disabled on Pagination greys out every control and blocks navigation.',
  },
]

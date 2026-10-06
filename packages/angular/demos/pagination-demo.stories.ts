import type { AngularStory } from './stories'

/** Story cards for the pagination Angular demo (titles + descriptions mirror demos/react/pagination.tsx). */
export const stories: AngularStory[] = [
  {
    title: 'Default',
    description: 'Pagination with prev/next, edge pages, ellipses, and an active page indicator.',
  },
  {
    title: 'Compact (no siblings)',
    description: 'sibling-count=0 keeps only the current page between ellipses for a tighter footprint.',
  },
  {
    title: 'Without first/last edges',
    description: 'Drop PaginationFirst and PaginationLast when only ±1 navigation is needed.',
  },
  {
    title: 'With edges (boundary 1)',
    description: 'show-edges keeps the first and last page visible regardless of the current selection.',
  },
  {
    title: 'Many pages with v-model',
    description: 'Two-way bind v-model:page to react to page changes outside the component.',
  },
  {
    title: 'Disabled',
    description: 'Setting :disabled on Pagination greys out every control and blocks navigation.',
  },
]

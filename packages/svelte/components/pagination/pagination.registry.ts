import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'pagination',
  type: 'registry:ui',
  categories: ['navigation'],
  framework: 'svelte',
  description:
    'Page-number bar with previous/next, ellipsis collapse, and a configurable visible-window size. Pair with a data-table or any paged list.',
  files: [
    { path: 'Pagination.svelte', target: 'components/ui/pagination/Pagination.svelte' },
    { path: 'PaginationEllipsis.svelte', target: 'components/ui/pagination/PaginationEllipsis.svelte' },
    { path: 'PaginationFirst.svelte', target: 'components/ui/pagination/PaginationFirst.svelte' },
    { path: 'PaginationLast.svelte', target: 'components/ui/pagination/PaginationLast.svelte' },
    { path: 'PaginationList.svelte', target: 'components/ui/pagination/PaginationList.svelte' },
    { path: 'PaginationListItem.svelte', target: 'components/ui/pagination/PaginationListItem.svelte' },
    { path: 'PaginationNext.svelte', target: 'components/ui/pagination/PaginationNext.svelte' },
    { path: 'PaginationPrev.svelte', target: 'components/ui/pagination/PaginationPrev.svelte' },
    { path: 'index.ts', target: 'components/ui/pagination/index.ts' },
  ],
  dependencies: ['@lucide/svelte'],
  registryDependencies: [],
})

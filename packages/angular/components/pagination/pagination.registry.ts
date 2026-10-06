import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'pagination',
  type: 'registry:ui',
  categories: ['navigation'],
  framework: 'angular',
  description:
    'Presentational page-number bar (nav > ul > li) with first/previous/next/last buttons and an ellipsis part. The caller owns the current page and renders the page window. Pair with a data-table or any paged list.',
  files: [
    { path: 'pagination.component.ts', target: 'components/ui/pagination/pagination.component.ts' },
    { path: 'index.ts', target: 'components/ui/pagination/index.ts' },
  ],
  dependencies: [],
  registryDependencies: [],
})

import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'pagination',
  type: 'registry:ui',
  categories: ['navigation'],
  description:
    'Page-number bar with previous/next, ellipsis collapse, and a configurable visible-window size. Pair with a data-table or any paged list.',
  files: [
    { path: 'pagination.tsx', target: 'components/ui/pagination/pagination.tsx' },
    { path: 'index.ts', target: 'components/ui/pagination/index.ts' },
  ],
  dependencies: ['lucide-react'],
  registryDependencies: [],
})

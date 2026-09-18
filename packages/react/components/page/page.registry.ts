import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'page',
  type: 'registry:ui',
  categories: ['layout'],
  description:
    'Page-level layout shell — title row, optional breadcrumbs, action bar, and slotted content well. The standard wrapper for route pages so every screen looks consistent.',
  files: [
    { path: 'page.tsx', target: 'components/ui/page/page.tsx' },
    { path: 'index.ts', target: 'components/ui/page/index.ts' },
  ],
  dependencies: [],
  registryDependencies: [],
})

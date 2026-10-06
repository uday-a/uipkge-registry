import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'page',
  type: 'registry:ui',
  categories: ['layout'],
  framework: 'angular',
  description:
    'Page-level layout shell — title row, optional breadcrumbs, action bar, and slotted content well. The standard wrapper for `routes/*.vue` pages so every screen looks consistent.',
  files: [
    { path: 'page.component.ts', target: 'components/ui/page/page.component.ts' },
    { path: 'index.ts', target: 'components/ui/page/index.ts' },
  ],
  dependencies: [],
  registryDependencies: [],
})

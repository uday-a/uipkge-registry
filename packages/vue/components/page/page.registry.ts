import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'page',
  type: 'registry:ui',
  categories: ['layout'],
  framework: 'vue',
  description:
    'Page-level layout shell — title row, optional breadcrumbs, action bar, and slotted content well. The standard wrapper for `routes/*.vue` pages so every screen looks consistent.',
  files: [
    { path: 'Page.vue', target: 'components/ui/page/Page.vue' },
    { path: 'PageBody.vue', target: 'components/ui/page/PageBody.vue' },
    { path: 'PageHeader.vue', target: 'components/ui/page/PageHeader.vue' },
    { path: 'PageHeaderHeading.vue', target: 'components/ui/page/PageHeaderHeading.vue' },
    { path: 'index.ts', target: 'components/ui/page/index.ts' },
  ],
  dependencies: [],
  registryDependencies: [],
})

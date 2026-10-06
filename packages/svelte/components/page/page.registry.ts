import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'page',
  type: 'registry:ui',
  categories: ['layout'],
  framework: 'svelte',
  description:
    'Page-level layout shell — title row, optional breadcrumbs, action bar, and slotted content well. The standard wrapper for `routes` pages so every screen looks consistent.',
  files: [
    { path: 'Page.svelte', target: 'components/ui/page/Page.svelte' },
    { path: 'PageBody.svelte', target: 'components/ui/page/PageBody.svelte' },
    { path: 'PageHeader.svelte', target: 'components/ui/page/PageHeader.svelte' },
    { path: 'PageHeaderHeading.svelte', target: 'components/ui/page/PageHeaderHeading.svelte' },
    { path: 'index.ts', target: 'components/ui/page/index.ts' },
  ],
  dependencies: [],
  registryDependencies: [],
})

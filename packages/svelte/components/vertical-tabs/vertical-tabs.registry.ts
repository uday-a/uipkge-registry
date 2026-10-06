import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'vertical-tabs',
  type: 'registry:ui',
  categories: ['navigation'],
  framework: 'svelte',
  description:
    'Settings-page navigation pattern — labels stack on the left, content panel on the right. Same API as Tabs but with a vertical orientation. Use for dense, multi-section settings UIs.',
  files: [
    { path: 'VerticalTabs.svelte', target: 'components/ui/vertical-tabs/VerticalTabs.svelte' },
    { path: 'VerticalTabsList.svelte', target: 'components/ui/vertical-tabs/VerticalTabsList.svelte' },
    { path: 'VerticalTabsSection.svelte', target: 'components/ui/vertical-tabs/VerticalTabsSection.svelte' },
    { path: 'VerticalTabsTrigger.svelte', target: 'components/ui/vertical-tabs/VerticalTabsTrigger.svelte' },
    { path: 'VerticalTabsContent.svelte', target: 'components/ui/vertical-tabs/VerticalTabsContent.svelte' },
    { path: 'index.ts', target: 'components/ui/vertical-tabs/index.ts' },
  ],
  dependencies: [],
  registryDependencies: [],
})

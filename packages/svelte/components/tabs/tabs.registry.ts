import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'tabs',
  type: 'registry:ui',
  categories: ['navigation'],
  framework: 'svelte',
  description:
    'Horizontal tab navigation with content panels — pick one panel at a time. Underline or pills variants. Hand-rolled roving keyboard navigation with automatic activation.',
  files: [
    { path: 'Tabs.svelte', target: 'components/ui/tabs/Tabs.svelte' },
    { path: 'TabsContent.svelte', target: 'components/ui/tabs/TabsContent.svelte' },
    { path: 'TabsList.svelte', target: 'components/ui/tabs/TabsList.svelte' },
    { path: 'TabsTrigger.svelte', target: 'components/ui/tabs/TabsTrigger.svelte' },
    { path: 'tabs.variants.ts', target: 'components/ui/tabs/tabs.variants.ts' },
    { path: 'context.ts', target: 'components/ui/tabs/context.ts' },
    { path: 'index.ts', target: 'components/ui/tabs/index.ts' },
  ],
  dependencies: ['class-variance-authority'],
  registryDependencies: [],
})

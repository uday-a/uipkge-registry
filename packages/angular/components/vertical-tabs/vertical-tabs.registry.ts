import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'vertical-tabs',
  type: 'registry:ui',
  categories: ['navigation'],
  framework: 'angular',
  description:
    'Settings-page navigation pattern — labels stack on the left, content panel on the right. Radix Tabs semantics locked to vertical orientation, with section headings and a sliding active indicator.',
  files: [
    { path: 'vertical-tabs.component.ts', target: 'components/ui/vertical-tabs/vertical-tabs.component.ts' },
    { path: 'index.ts', target: 'components/ui/vertical-tabs/index.ts' },
  ],
  dependencies: [],
  registryDependencies: [],
})

import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'tabs',
  type: 'registry:ui',
  categories: ['navigation'],
  framework: 'angular',
  description:
    'Tab navigation with content panels — pick one panel at a time. Segmented, pill or underline variants with a sliding active indicator, horizontal or vertical. Radix Tabs behaviour: roving arrow-key focus, automatic or manual activation, inactive panels unmounted.',
  files: [
    { path: 'tabs.component.ts', target: 'components/ui/tabs/tabs.component.ts' },
    { path: 'tabs.variants.ts', target: 'components/ui/tabs/tabs.variants.ts' },
    { path: 'index.ts', target: 'components/ui/tabs/index.ts' },
  ],
  dependencies: ['class-variance-authority'],
  registryDependencies: ['https://uipkge.dev/r/popper.json'],
})

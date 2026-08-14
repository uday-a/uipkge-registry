import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'quick-actions',
  type: 'registry:block',
  categories: ['layout', 'dashboard'],
  description:
    'Vertical list of clickable shortcuts in a SectionCard. Pass linkComponent (NuxtLink or RouterLink) for SPA routing.',
  framework: 'vue',
  files: [{ path: 'QuickActions.vue', target: 'components/blocks/QuickActions.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: ['https://uipkge.dev/r/section-card.json', 'https://uipkge.dev/r/icon-box.json'],
})

import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'progress-breakdown',
  type: 'registry:block',
  categories: ['analytics', 'dashboard'],
  description: 'Labeled progress bars in a SectionCard. Each bar cycles through chart-1..5 colors.',
  framework: 'vue',
  files: [{ path: 'ProgressBreakdown.vue', target: 'components/blocks/ProgressBreakdown.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: ['https://uipkge.dev/r/section-card.json', 'https://uipkge.dev/r/progress-item.json'],
})

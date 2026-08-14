import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'bento-metrics-mixed',
  title: 'Bento — Mixed Metrics',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Five-tile bento mixing headline numbers, an inline sparkline, a short list, and a status tile, for the summary band beneath a hero.',
  framework: 'vue',
  files: [{ path: 'BentoMetricsMixed.vue', target: 'components/blocks/BentoMetricsMixed.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/separator.json',
  ],
})

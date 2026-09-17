import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'stats-band-sparklines',
  title: 'Stats — Band with Sparklines',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Metric band pairing each headline figure with an inline sparkline and its period, so a number arrives with the shape of the trend behind it.',
  framework: 'vue',
  files: [{ path: 'StatsBandSparklines.vue', target: 'components/blocks/StatsBandSparklines.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/separator.json',
  ],
})

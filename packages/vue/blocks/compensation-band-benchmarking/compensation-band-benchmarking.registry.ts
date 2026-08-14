import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'compensation-band-benchmarking',
  type: 'registry:block',
  categories: ['hr', 'dashboard', 'analytics', 'app'],
  description:
    'Pave/Levels.fyi style engineering salary and equity compensation band visualizer with P25, P50, P75, P90 percentile ranges, level progression matrix, compa-ratio diagnostics, and certified pay equity audit.',
  framework: 'vue',
  files: [
    {
      path: 'CompensationBandBenchmarking.vue',
      target: 'components/blocks/CompensationBandBenchmarking.vue',
    },
  ],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/progress.json',
    'https://uipkge.dev/r/select.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/table.json',
  ],
})

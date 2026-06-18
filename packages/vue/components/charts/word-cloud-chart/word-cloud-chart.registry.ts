import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'word-cloud-chart',
  type: 'registry:ui',
  framework: 'vue',
  categories: ['chart'],
  description:
    'Word cloud as dependency-free SVG-friendly markup. Frequency-sized words coloured from the chart palette with hover emphasis. No extra npm packages.',
  files: [
    { path: 'WordCloudChart.vue', target: 'components/ui/charts/word-cloud-chart/WordCloudChart.vue' },
    { path: 'index.ts', target: 'components/ui/charts/word-cloud-chart/index.ts' },
  ],
  dependencies: [],
  registryDependencies: [],
})

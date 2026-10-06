import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'word-cloud-chart',
  type: 'registry:ui',
  framework: 'svelte',
  categories: ['chart'],
  description:
    'Word cloud as dependency-free markup. Frequency-sized words coloured from the chart palette with hover emphasis. No extra npm packages.',
  files: [
    { path: 'WordCloudChart.svelte', target: 'components/ui/word-cloud-chart/WordCloudChart.svelte' },
    { path: 'index.ts', target: 'components/ui/word-cloud-chart/index.ts' },
  ],
  dependencies: [],
  registryDependencies: [],
})

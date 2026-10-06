import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'word-cloud-chart',
  type: 'registry:ui',
  framework: 'angular',
  categories: ['chart'],
  description:
    'Word cloud as dependency-free SVG-friendly markup. Frequency-sized words coloured from the chart palette with hover emphasis. No extra npm packages.',
  files: [
    {
      path: 'word-cloud-chart.component.ts',
      target: 'components/ui/charts/word-cloud-chart/word-cloud-chart.component.ts',
    },
    { path: 'index.ts', target: 'components/ui/charts/word-cloud-chart/index.ts' },
    { path: '../use-chart-theme.ts', target: 'components/ui/charts/use-chart-theme.ts' },
  ],
  dependencies: ['echarts'],
  registryDependencies: [],
})

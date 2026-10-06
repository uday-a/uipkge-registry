import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'chord-chart',
  type: 'registry:ui',
  framework: 'angular',
  categories: ['chart'],
  description:
    'Chord diagram around Apache ECharts. Circular nodes with weighted ribbons and adjacency focus. Theme-aware via registry tokens.',
  files: [
    { path: 'chord-chart.component.ts', target: 'components/ui/charts/chord-chart/chord-chart.component.ts' },
    { path: 'index.ts', target: 'components/ui/charts/chord-chart/index.ts' },
    { path: '../use-chart-theme.ts', target: 'components/ui/charts/use-chart-theme.ts' },
  ],
  dependencies: ['echarts'],
  registryDependencies: [],
})

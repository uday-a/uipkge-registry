import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'heatmap',
  type: 'registry:ui',
  framework: 'angular',
  categories: ['chart'],
  description:
    'Heatmap wrapper around Apache ECharts. Category/category intensity grid with a continuous visual map. Theme-aware via registry tokens.',
  files: [
    { path: 'heatmap.component.ts', target: 'components/ui/charts/heatmap/heatmap.component.ts' },
    { path: 'index.ts', target: 'components/ui/charts/heatmap/index.ts' },
    { path: '../use-chart-theme.ts', target: 'components/ui/charts/use-chart-theme.ts' },
  ],
  dependencies: ['echarts'],
  registryDependencies: [],
})

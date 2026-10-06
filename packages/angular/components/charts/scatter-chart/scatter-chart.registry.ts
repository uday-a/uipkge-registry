import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'scatter-chart',
  type: 'registry:ui',
  framework: 'angular',
  categories: ['chart'],
  description:
    'Scatter chart wrapper around Apache ECharts. Value/value point cloud with configurable symbol size and shape. Theme-aware via registry tokens.',
  files: [
    { path: 'scatter-chart.component.ts', target: 'components/ui/charts/scatter-chart/scatter-chart.component.ts' },
    { path: 'index.ts', target: 'components/ui/charts/scatter-chart/index.ts' },
    { path: '../use-chart-theme.ts', target: 'components/ui/charts/use-chart-theme.ts' },
  ],
  dependencies: ['echarts'],
  registryDependencies: [],
})

import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'quadrant-chart',
  type: 'registry:ui',
  framework: 'angular',
  categories: ['chart'],
  description:
    'Quadrant (2×2 matrix) chart around Apache ECharts. Median-split scatter with labelled strategy quadrants. Theme-aware via registry tokens.',
  files: [
    { path: 'quadrant-chart.component.ts', target: 'components/ui/charts/quadrant-chart/quadrant-chart.component.ts' },
    { path: 'index.ts', target: 'components/ui/charts/quadrant-chart/index.ts' },
    { path: '../use-chart-theme.ts', target: 'components/ui/charts/use-chart-theme.ts' },
  ],
  dependencies: ['echarts'],
  registryDependencies: [],
})

import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'range-area-chart',
  type: 'registry:ui',
  framework: 'angular',
  categories: ['chart'],
  description:
    'Range-area chart around Apache ECharts. Min/max uncertainty band with an average trend line. Theme-aware via registry tokens.',
  files: [
    {
      path: 'range-area-chart.component.ts',
      target: 'components/ui/charts/range-area-chart/range-area-chart.component.ts',
    },
    { path: 'index.ts', target: 'components/ui/charts/range-area-chart/index.ts' },
    { path: '../use-chart-theme.ts', target: 'components/ui/charts/use-chart-theme.ts' },
  ],
  dependencies: ['echarts'],
  registryDependencies: [],
})

import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'pictorial-bar-chart',
  type: 'registry:ui',
  framework: 'angular',
  categories: ['chart'],
  description:
    'Pictorial bar chart around Apache ECharts. Repeated symbols fill to the value with a configurable symbol shape. Theme-aware via registry tokens.',
  files: [
    {
      path: 'pictorial-bar-chart.component.ts',
      target: 'components/ui/charts/pictorial-bar-chart/pictorial-bar-chart.component.ts',
    },
    { path: 'index.ts', target: 'components/ui/charts/pictorial-bar-chart/index.ts' },
    { path: '../use-chart-theme.ts', target: 'components/ui/charts/use-chart-theme.ts' },
  ],
  dependencies: ['echarts'],
  registryDependencies: [],
})

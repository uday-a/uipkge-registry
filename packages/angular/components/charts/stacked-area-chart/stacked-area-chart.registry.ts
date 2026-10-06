import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'stacked-area-chart',
  type: 'registry:ui',
  framework: 'angular',
  categories: ['chart'],
  description:
    'Stacked area chart around Apache ECharts. Absolute or 100% stream stacking with smooth curves. Theme-aware via registry tokens.',
  files: [
    {
      path: 'stacked-area-chart.component.ts',
      target: 'components/ui/charts/stacked-area-chart/stacked-area-chart.component.ts',
    },
    { path: 'index.ts', target: 'components/ui/charts/stacked-area-chart/index.ts' },
    { path: '../use-chart-theme.ts', target: 'components/ui/charts/use-chart-theme.ts' },
  ],
  dependencies: ['echarts'],
  registryDependencies: [],
})

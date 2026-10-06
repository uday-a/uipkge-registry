import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'histogram-chart',
  type: 'registry:ui',
  framework: 'angular',
  categories: ['chart'],
  description:
    'Histogram wrapper around Apache ECharts. Auto-bins raw values or renders pre-binned counts with zero-gap bars and a highlighted peak. Theme-aware via registry tokens.',
  files: [
    {
      path: 'histogram-chart.component.ts',
      target: 'components/ui/charts/histogram-chart/histogram-chart.component.ts',
    },
    { path: 'index.ts', target: 'components/ui/charts/histogram-chart/index.ts' },
    { path: '../use-chart-theme.ts', target: 'components/ui/charts/use-chart-theme.ts' },
  ],
  dependencies: ['echarts'],
  registryDependencies: [],
})

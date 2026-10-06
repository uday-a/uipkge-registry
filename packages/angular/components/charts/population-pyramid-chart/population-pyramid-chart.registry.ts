import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'population-pyramid-chart',
  type: 'registry:ui',
  framework: 'angular',
  categories: ['chart'],
  description:
    'Population pyramid (mirrored bar) chart around Apache ECharts. Back-to-back horizontal bars with absolute-value labels. Theme-aware via registry tokens.',
  files: [
    {
      path: 'population-pyramid-chart.component.ts',
      target: 'components/ui/charts/population-pyramid-chart/population-pyramid-chart.component.ts',
    },
    { path: 'index.ts', target: 'components/ui/charts/population-pyramid-chart/index.ts' },
    { path: '../use-chart-theme.ts', target: 'components/ui/charts/use-chart-theme.ts' },
  ],
  dependencies: ['echarts'],
  registryDependencies: [],
})

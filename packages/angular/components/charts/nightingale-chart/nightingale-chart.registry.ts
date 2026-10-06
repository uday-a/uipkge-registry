import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'nightingale-chart',
  type: 'registry:ui',
  framework: 'angular',
  categories: ['chart'],
  description:
    'Nightingale (rose) chart around Apache ECharts. Radius-encoded pie with rounded segments. Theme-aware via registry tokens.',
  files: [
    {
      path: 'nightingale-chart.component.ts',
      target: 'components/ui/charts/nightingale-chart/nightingale-chart.component.ts',
    },
    { path: 'index.ts', target: 'components/ui/charts/nightingale-chart/index.ts' },
    { path: '../use-chart-theme.ts', target: 'components/ui/charts/use-chart-theme.ts' },
  ],
  dependencies: ['echarts'],
  registryDependencies: [],
})

import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'bullet-chart',
  type: 'registry:ui',
  framework: 'angular',
  categories: ['chart'],
  description:
    'Bullet chart for KPI vs target around Apache ECharts. Qualitative background bands, a foreground actual bar, and a target marker per row. Theme-aware via registry tokens.',
  files: [
    { path: 'bullet-chart.component.ts', target: 'components/ui/charts/bullet-chart/bullet-chart.component.ts' },
    { path: 'index.ts', target: 'components/ui/charts/bullet-chart/index.ts' },
    { path: '../use-chart-theme.ts', target: 'components/ui/charts/use-chart-theme.ts' },
  ],
  dependencies: ['echarts'],
  registryDependencies: [],
})

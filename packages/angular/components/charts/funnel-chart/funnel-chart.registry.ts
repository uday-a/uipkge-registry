import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'funnel-chart',
  type: 'registry:ui',
  framework: 'angular',
  categories: ['chart'],
  description:
    'Funnel chart wrapper around Apache ECharts. Conversion stages with configurable sort, orientation and gap. Theme-aware via registry tokens.',
  files: [
    { path: 'funnel-chart.component.ts', target: 'components/ui/charts/funnel-chart/funnel-chart.component.ts' },
    { path: 'index.ts', target: 'components/ui/charts/funnel-chart/index.ts' },
    { path: '../use-chart-theme.ts', target: 'components/ui/charts/use-chart-theme.ts' },
  ],
  dependencies: ['echarts'],
  registryDependencies: [],
})

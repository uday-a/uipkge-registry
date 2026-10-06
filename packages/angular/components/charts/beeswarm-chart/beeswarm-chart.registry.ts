import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'beeswarm-chart',
  type: 'registry:ui',
  framework: 'angular',
  categories: ['chart'],
  description:
    'Beeswarm (jittered strip) plot around Apache ECharts. One dot per observation grouped on rows with deterministic jitter. Theme-aware via registry tokens.',
  files: [
    { path: 'beeswarm-chart.component.ts', target: 'components/ui/charts/beeswarm-chart/beeswarm-chart.component.ts' },
    { path: 'index.ts', target: 'components/ui/charts/beeswarm-chart/index.ts' },
    { path: '../use-chart-theme.ts', target: 'components/ui/charts/use-chart-theme.ts' },
  ],
  dependencies: ['echarts'],
  registryDependencies: [],
})

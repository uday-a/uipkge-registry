import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'icicle-chart',
  type: 'registry:ui',
  framework: 'angular',
  categories: ['chart'],
  description:
    'Icicle (partition) chart around Apache ECharts custom series — ECharts ships no icicle series, so this partitions one rect per node top-down with in-canvas labels. Theme-aware via registry tokens.',
  files: [
    { path: 'icicle-chart.component.ts', target: 'components/ui/charts/icicle-chart/icicle-chart.component.ts' },
    { path: 'index.ts', target: 'components/ui/charts/icicle-chart/index.ts' },
    { path: '../use-chart-theme.ts', target: 'components/ui/charts/use-chart-theme.ts' },
  ],
  dependencies: ['echarts'],
  registryDependencies: [],
})

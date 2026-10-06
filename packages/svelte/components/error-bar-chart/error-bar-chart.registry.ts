import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'error-bar-chart',
  type: 'registry:ui',
  framework: 'svelte',
  categories: ['chart'],
  description:
    'Error-bar chart around Apache ECharts custom series. Mean bars with confidence-interval whiskers and caps. Theme-aware via registry tokens.',
  files: [
    { path: 'ErrorBarChart.svelte', target: 'components/ui/error-bar-chart/ErrorBarChart.svelte' },
    { path: 'index.ts', target: 'components/ui/error-bar-chart/index.ts' },
    { path: 'chart-theme.ts', target: 'components/ui/error-bar-chart/chart-theme.ts' },
  ],
  dependencies: ['echarts'],
  registryDependencies: [],
})

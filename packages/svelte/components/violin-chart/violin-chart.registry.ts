import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'violin-chart',
  type: 'registry:ui',
  framework: 'svelte',
  categories: ['chart'],
  description:
    'Violin chart around Apache ECharts custom series. Gaussian-KDE density halves with quartile box, median dot, and whiskers per group. Theme-aware via registry tokens.',
  files: [
    { path: 'ViolinChart.svelte', target: 'components/ui/violin-chart/ViolinChart.svelte' },
    { path: 'index.ts', target: 'components/ui/violin-chart/index.ts' },
    { path: 'useChartTheme.svelte.ts', target: 'components/ui/violin-chart/useChartTheme.svelte.ts' },
  ],
  dependencies: ['echarts'],
  registryDependencies: [],
})

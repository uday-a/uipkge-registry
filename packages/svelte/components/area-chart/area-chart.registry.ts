import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'area-chart',
  type: 'registry:ui',
  framework: 'svelte',
  categories: ['chart'],
  description:
    'Filled-area line chart wrapper around Apache ECharts. Multi-series, stacked, gradient, and stepped variants. Theme-aware via registry tokens (--chart-1..5, --muted-foreground, --border).',
  files: [
    { path: 'AreaChart.svelte', target: 'components/ui/charts/area-chart/AreaChart.svelte' },
    { path: 'index.ts', target: 'components/ui/charts/area-chart/index.ts' },
    { path: 'useChartTheme.ts', target: 'components/ui/charts/useChartTheme.ts' },
  ],
  dependencies: ['echarts'],
  registryDependencies: [],
})

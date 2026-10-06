import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'line-chart',
  type: 'registry:ui',
  framework: 'svelte',
  categories: ['chart'],
  description:
    'Line chart wrapper around Apache ECharts. Smooth/stepped/dashed lines, multi-series, point markers. Theme-aware via registry tokens.',
  files: [
    { path: 'LineChart.svelte', target: 'components/ui/line-chart/LineChart.svelte' },
    { path: 'index.ts', target: 'components/ui/line-chart/index.ts' },
    { path: 'useChartTheme.svelte.ts', target: 'components/ui/line-chart/useChartTheme.svelte.ts' },
  ],
  dependencies: ['echarts'],
  registryDependencies: [],
})

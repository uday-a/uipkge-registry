import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'bar-chart',
  type: 'registry:ui',
  framework: 'svelte',
  categories: ['chart'],
  description:
    'Bar chart wrapper around Apache ECharts. Vertical, horizontal, grouped, stacked, and negative-value variants. Theme-aware via registry tokens.',
  files: [
    { path: 'BarChart.svelte', target: 'components/ui/bar-chart/BarChart.svelte' },
    { path: 'chart-theme.svelte.ts', target: 'components/ui/bar-chart/chart-theme.svelte.ts' },
    { path: 'index.ts', target: 'components/ui/bar-chart/index.ts' },
  ],
  dependencies: ['echarts'],
  registryDependencies: [],
})

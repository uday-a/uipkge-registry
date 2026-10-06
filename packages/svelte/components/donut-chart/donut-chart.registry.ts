import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'donut-chart',
  type: 'registry:ui',
  framework: 'svelte',
  categories: ['chart'],
  description:
    'Donut chart wrapper around Apache ECharts. Full and half (semicircle) types, adjustable ring thickness down to a filled pie, rounded segments, gaps, and a centre KPI total. Theme-aware via registry tokens.',
  files: [
    { path: 'DonutChart.svelte', target: 'components/ui/donut-chart/DonutChart.svelte' },
    { path: 'index.ts', target: 'components/ui/donut-chart/index.ts' },
    { path: 'chart-theme.ts', target: 'components/ui/donut-chart/chart-theme.ts' },
  ],
  dependencies: ['echarts'],
  registryDependencies: [],
})

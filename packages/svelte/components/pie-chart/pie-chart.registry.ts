import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'pie-chart',
  type: 'registry:ui',
  framework: 'svelte',
  categories: ['chart'],
  description:
    'Pie chart wrapper around Apache ECharts. Full pie, donut, rose (Nightingale), and labeled variants. Theme-aware via registry tokens.',
  files: [
    { path: 'PieChart.svelte', target: 'components/ui/charts/pie-chart/PieChart.svelte' },
    { path: 'index.ts', target: 'components/ui/charts/pie-chart/index.ts' },
    { path: 'useChartTheme.ts', target: 'components/ui/charts/pie-chart/useChartTheme.ts' },
  ],
  dependencies: ['echarts'],
  registryDependencies: [],
})

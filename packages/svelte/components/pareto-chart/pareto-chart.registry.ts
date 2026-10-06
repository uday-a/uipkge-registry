import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'pareto-chart',
  type: 'registry:ui',
  framework: 'svelte',
  categories: ['chart'],
  description:
    'Pareto chart around Apache ECharts. Sorted bars with an auto-computed cumulative % line on a dual axis. Theme-aware via registry tokens.',
  files: [
    { path: 'ParetoChart.svelte', target: 'components/ui/charts/pareto-chart/ParetoChart.svelte' },
    { path: 'index.ts', target: 'components/ui/charts/pareto-chart/index.ts' },
    { path: 'useChartTheme.ts', target: 'components/ui/charts/pareto-chart/useChartTheme.ts' },
  ],
  dependencies: ['echarts'],
  registryDependencies: [],
})

import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'stacked-bar-chart',
  type: 'registry:ui',
  framework: 'svelte',
  categories: ['chart'],
  description:
    'Stacked bar chart around Apache ECharts. Absolute or 100% share stacking with legend; negative stacks diverge for Likert scales. Theme-aware via registry tokens.',
  files: [
    { path: 'StackedBarChart.svelte', target: 'components/ui/charts/stacked-bar-chart/StackedBarChart.svelte' },
    { path: 'index.ts', target: 'components/ui/charts/stacked-bar-chart/index.ts' },
    { path: 'useChartTheme.ts', target: 'components/ui/charts/stacked-bar-chart/useChartTheme.ts' },
  ],
  dependencies: ['echarts'],
  registryDependencies: [],
})

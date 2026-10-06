import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'range-bar-chart',
  type: 'registry:ui',
  framework: 'svelte',
  categories: ['chart'],
  description:
    'Range-bar (floating bar / column-range) chart around Apache ECharts. Min–max bands via a transparent base stack, vertical or horizontal, with range labels. Theme-aware via registry tokens.',
  files: [
    { path: 'RangeBarChart.svelte', target: 'components/ui/charts/range-bar-chart/RangeBarChart.svelte' },
    { path: 'index.ts', target: 'components/ui/charts/range-bar-chart/index.ts' },
    { path: 'useChartTheme.ts', target: 'components/ui/charts/range-bar-chart/useChartTheme.ts' },
  ],
  dependencies: ['echarts'],
  registryDependencies: [],
})

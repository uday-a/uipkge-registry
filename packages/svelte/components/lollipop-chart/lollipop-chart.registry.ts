import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'lollipop-chart',
  type: 'registry:ui',
  framework: 'svelte',
  categories: ['chart'],
  description:
    'Lollipop chart around Apache ECharts. Thin stems with dot endpoints and value labels. Theme-aware via registry tokens.',
  files: [
    { path: 'LollipopChart.svelte', target: 'components/ui/lollipop-chart/LollipopChart.svelte' },
    { path: 'index.ts', target: 'components/ui/lollipop-chart/index.ts' },
    { path: 'useChartTheme.svelte.ts', target: 'components/ui/lollipop-chart/useChartTheme.svelte.ts' },
  ],
  dependencies: ['echarts'],
  registryDependencies: [],
})

import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'raw-chart',
  type: 'registry:ui',
  framework: 'svelte',
  categories: ['chart'],
  description:
    'Escape-hatch wrapper that takes a full ECharts option object. Lets you build any ECharts type (sankey, sunburst, candlestick, graph, boxplot, parallel, themeRiver, custom) with full customization. Theme-aware exports available via useChartTheme.',
  files: [
    { path: 'RawChart.svelte', target: 'components/ui/charts/raw-chart/RawChart.svelte' },
    { path: 'index.ts', target: 'components/ui/charts/raw-chart/index.ts' },
    { path: 'useChartTheme.ts', target: 'components/ui/charts/raw-chart/useChartTheme.ts' },
  ],
  dependencies: ['echarts'],
  registryDependencies: [],
})

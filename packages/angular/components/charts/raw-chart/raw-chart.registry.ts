import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'raw-chart',
  type: 'registry:ui',
  framework: 'angular',
  categories: ['chart'],
  description:
    'Escape-hatch wrapper that takes a full ECharts option object. Lets you build any ECharts type (sankey, sunburst, candlestick, graph, boxplot, parallel, themeRiver, custom) with full customization. Theme-aware exports available via useChartTheme.',
  files: [
    { path: 'raw-chart.component.ts', target: 'components/ui/charts/raw-chart/raw-chart.component.ts' },
    { path: 'index.ts', target: 'components/ui/charts/raw-chart/index.ts' },
    { path: '../use-chart-theme.ts', target: 'components/ui/charts/use-chart-theme.ts' },
  ],
  dependencies: ['echarts'],
  registryDependencies: [],
})

import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'theme-river',
  type: 'registry:ui',
  framework: 'angular',
  categories: ['chart'],
  description:
    'Theme-river (streamgraph) wrapper around Apache ECharts. Stacked areas centred on a baseline along a time axis — good for topic-volume drift over time.',
  files: [
    { path: 'theme-river.component.ts', target: 'components/ui/charts/theme-river/theme-river.component.ts' },
    { path: 'index.ts', target: 'components/ui/charts/theme-river/index.ts' },
    { path: '../use-chart-theme.ts', target: 'components/ui/charts/use-chart-theme.ts' },
  ],
  dependencies: ['echarts'],
  registryDependencies: [],
})

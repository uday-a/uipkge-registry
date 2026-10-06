import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'slope-chart',
  type: 'registry:ui',
  framework: 'angular',
  categories: ['chart'],
  description:
    'Slope and bump chart around Apache ECharts. Rank or value lines across two (slope) or many (bump) points with end labels. Theme-aware via registry tokens.',
  files: [
    { path: 'slope-chart.component.ts', target: 'components/ui/charts/slope-chart/slope-chart.component.ts' },
    { path: 'index.ts', target: 'components/ui/charts/slope-chart/index.ts' },
    { path: '../use-chart-theme.ts', target: 'components/ui/charts/use-chart-theme.ts' },
  ],
  dependencies: ['echarts'],
  registryDependencies: [],
})

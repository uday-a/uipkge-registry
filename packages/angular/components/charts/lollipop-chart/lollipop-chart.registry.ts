import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'lollipop-chart',
  type: 'registry:ui',
  framework: 'angular',
  categories: ['chart'],
  description:
    'Lollipop chart around Apache ECharts. Thin stems with dot endpoints and value labels. Theme-aware via registry tokens.',
  files: [
    { path: 'lollipop-chart.component.ts', target: 'components/ui/charts/lollipop-chart/lollipop-chart.component.ts' },
    { path: 'index.ts', target: 'components/ui/charts/lollipop-chart/index.ts' },
    { path: '../use-chart-theme.ts', target: 'components/ui/charts/use-chart-theme.ts' },
  ],
  dependencies: ['echarts'],
  registryDependencies: [],
})

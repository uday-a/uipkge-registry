import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'marimekko-chart',
  type: 'registry:ui',
  framework: 'angular',
  categories: ['chart'],
  description:
    'Marimekko (mosaic) chart around Apache ECharts custom series. Column widths encode column totals, stacked segments encode within-column shares, with in-canvas labels. Theme-aware via registry tokens.',
  files: [
    {
      path: 'marimekko-chart.component.ts',
      target: 'components/ui/charts/marimekko-chart/marimekko-chart.component.ts',
    },
    { path: 'index.ts', target: 'components/ui/charts/marimekko-chart/index.ts' },
    { path: '../use-chart-theme.ts', target: 'components/ui/charts/use-chart-theme.ts' },
  ],
  dependencies: ['echarts'],
  registryDependencies: [],
})

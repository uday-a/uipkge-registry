import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'range-bar-chart',
  type: 'registry:ui',
  framework: 'angular',
  categories: ['chart'],
  description:
    'Range-bar (floating bar / column-range) chart around Apache ECharts. Min–max bands via a transparent base stack, vertical or horizontal, with range labels. Theme-aware via registry tokens.',
  files: [
    {
      path: 'range-bar-chart.component.ts',
      target: 'components/ui/charts/range-bar-chart/range-bar-chart.component.ts',
    },
    { path: 'index.ts', target: 'components/ui/charts/range-bar-chart/index.ts' },
    { path: '../use-chart-theme.ts', target: 'components/ui/charts/use-chart-theme.ts' },
  ],
  dependencies: ['echarts'],
  registryDependencies: [],
})

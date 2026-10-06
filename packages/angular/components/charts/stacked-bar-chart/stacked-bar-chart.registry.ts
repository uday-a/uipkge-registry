import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'stacked-bar-chart',
  type: 'registry:ui',
  framework: 'angular',
  categories: ['chart'],
  description:
    'Stacked bar chart around Apache ECharts. Absolute or 100% share stacking with legend; negative stacks diverge for Likert scales. Theme-aware via registry tokens.',
  files: [
    {
      path: 'stacked-bar-chart.component.ts',
      target: 'components/ui/charts/stacked-bar-chart/stacked-bar-chart.component.ts',
    },
    { path: 'index.ts', target: 'components/ui/charts/stacked-bar-chart/index.ts' },
    { path: '../use-chart-theme.ts', target: 'components/ui/charts/use-chart-theme.ts' },
  ],
  dependencies: ['echarts'],
  registryDependencies: [],
})

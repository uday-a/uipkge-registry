import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'pareto-chart',
  type: 'registry:ui',
  framework: 'angular',
  categories: ['chart'],
  description:
    'Pareto chart around Apache ECharts. Sorted bars with an auto-computed cumulative % line on a dual axis. Theme-aware via registry tokens.',
  files: [
    { path: 'pareto-chart.component.ts', target: 'components/ui/charts/pareto-chart/pareto-chart.component.ts' },
    { path: 'index.ts', target: 'components/ui/charts/pareto-chart/index.ts' },
    { path: '../use-chart-theme.ts', target: 'components/ui/charts/use-chart-theme.ts' },
  ],
  dependencies: ['echarts'],
  registryDependencies: [],
})

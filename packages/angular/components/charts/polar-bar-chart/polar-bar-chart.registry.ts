import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'polar-bar-chart',
  type: 'registry:ui',
  framework: 'angular',
  categories: ['chart'],
  description:
    'Radial bar chart on the ECharts polar coordinate system. Categories around the radius axis with rounded caps. Theme-aware via registry tokens.',
  files: [
    {
      path: 'polar-bar-chart.component.ts',
      target: 'components/ui/charts/polar-bar-chart/polar-bar-chart.component.ts',
    },
    { path: 'index.ts', target: 'components/ui/charts/polar-bar-chart/index.ts' },
    { path: '../use-chart-theme.ts', target: 'components/ui/charts/use-chart-theme.ts' },
  ],
  dependencies: ['echarts'],
  registryDependencies: [],
})

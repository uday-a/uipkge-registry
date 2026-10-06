import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'waffle-chart',
  type: 'registry:ui',
  framework: 'angular',
  categories: ['chart'],
  description: 'Waffle chart as dependency-free SVG. 10×10 part-to-whole grid with legend. No extra npm packages.',
  files: [
    { path: 'waffle-chart.component.ts', target: 'components/ui/charts/waffle-chart/waffle-chart.component.ts' },
    { path: 'index.ts', target: 'components/ui/charts/waffle-chart/index.ts' },
    { path: '../use-chart-theme.ts', target: 'components/ui/charts/use-chart-theme.ts' },
  ],
  dependencies: ['echarts'],
  registryDependencies: [],
})

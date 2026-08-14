import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'waffle-chart',
  type: 'registry:ui',
  framework: 'vue',
  categories: ['chart'],
  description: 'Waffle chart as dependency-free SVG. 10×10 part-to-whole grid with legend. No extra npm packages.',
  files: [
    { path: 'WaffleChart.vue', target: 'components/ui/charts/waffle-chart/WaffleChart.vue' },
    { path: 'index.ts', target: 'components/ui/charts/waffle-chart/index.ts' },
  ],
  dependencies: [],
  registryDependencies: [],
})

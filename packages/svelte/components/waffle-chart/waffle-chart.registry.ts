import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'waffle-chart',
  type: 'registry:ui',
  framework: 'svelte',
  categories: ['chart'],
  description: 'Waffle chart as dependency-free SVG. 10×10 part-to-whole grid with legend. No extra npm packages.',
  files: [
    { path: 'WaffleChart.svelte', target: 'components/ui/waffle-chart/WaffleChart.svelte' },
    { path: 'index.ts', target: 'components/ui/waffle-chart/index.ts' },
  ],
  dependencies: [],
  registryDependencies: [],
})

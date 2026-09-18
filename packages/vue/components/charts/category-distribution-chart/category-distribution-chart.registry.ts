import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'category-distribution-chart',
  type: 'registry:ui',
  framework: 'vue',
  categories: ['chart'],
  description:
    'Category distribution as dependency-free markup. Primary KPI with trend pill, proportional stacked bar, and legend. Shares auto-normalise. Picks up chart tokens via CSS variables.',
  files: [
    {
      path: 'CategoryDistributionChart.vue',
      target: 'components/ui/charts/category-distribution-chart/CategoryDistributionChart.vue',
    },
    { path: 'index.ts', target: 'components/ui/charts/category-distribution-chart/index.ts' },
  ],
  dependencies: [],
  registryDependencies: [],
})

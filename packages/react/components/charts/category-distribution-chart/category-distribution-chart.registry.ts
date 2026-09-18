import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'category-distribution-chart',
  type: 'registry:ui',
  categories: ['chart'],
  description:
    'React mirror of @uipkge/category-distribution-chart — see the Vue registry item for the canonical description.',
  files: [
    {
      path: 'CategoryDistributionChart.tsx',
      target: 'components/ui/charts/category-distribution-chart/CategoryDistributionChart.tsx',
    },
    { path: 'index.ts', target: 'components/ui/charts/category-distribution-chart/index.ts' },
    { path: '../shared.tsx', target: 'components/ui/charts/shared.tsx' },
  ],
  dependencies: ['echarts', 'echarts-for-react'],
  registryDependencies: [],
})

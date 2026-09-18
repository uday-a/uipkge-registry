import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'parallel-chart',
  type: 'registry:ui',
  categories: ['chart'],
  description: 'React mirror of @uipkge/parallel-chart — see the Vue registry item for the canonical description.',
  files: [
    { path: 'ParallelChart.tsx', target: 'components/ui/charts/parallel-chart/ParallelChart.tsx' },
    { path: 'index.ts', target: 'components/ui/charts/parallel-chart/index.ts' },
    { path: '../useChartTheme.ts', target: 'components/ui/charts/useChartTheme.ts' },
    { path: '../shared.tsx', target: 'components/ui/charts/shared.tsx' },
  ],
  dependencies: ['echarts', 'echarts-for-react'],
  registryDependencies: [],
})

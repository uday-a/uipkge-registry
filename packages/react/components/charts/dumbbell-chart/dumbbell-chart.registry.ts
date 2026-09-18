import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'dumbbell-chart',
  type: 'registry:ui',
  categories: ['chart'],
  description: 'React mirror of @uipkge/dumbbell-chart — see the Vue registry item for the canonical description.',
  files: [
    { path: 'DumbbellChart.tsx', target: 'components/ui/charts/dumbbell-chart/DumbbellChart.tsx' },
    { path: 'index.ts', target: 'components/ui/charts/dumbbell-chart/index.ts' },
    { path: '../useChartTheme.ts', target: 'components/ui/charts/useChartTheme.ts' },
    { path: '../shared.tsx', target: 'components/ui/charts/shared.tsx' },
  ],
  dependencies: ['echarts', 'echarts-for-react'],
  registryDependencies: [],
})

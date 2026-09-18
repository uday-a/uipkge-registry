import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'quadrant-chart',
  type: 'registry:ui',
  categories: ['chart'],
  description: 'React mirror of @uipkge/quadrant-chart — see the Vue registry item for the canonical description.',
  files: [
    { path: 'QuadrantChart.tsx', target: 'components/ui/charts/quadrant-chart/QuadrantChart.tsx' },
    { path: 'index.ts', target: 'components/ui/charts/quadrant-chart/index.ts' },
    { path: '../useChartTheme.ts', target: 'components/ui/charts/useChartTheme.ts' },
    { path: '../shared.tsx', target: 'components/ui/charts/shared.tsx' },
  ],
  dependencies: ['echarts', 'echarts-for-react'],
  registryDependencies: [],
})

import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'bar-chart',
  type: 'registry:ui',
  categories: ['chart'],
  description: 'React mirror of @uipkge/bar-chart — see the Vue registry item for the canonical description.',
  files: [
    { path: 'BarChart.tsx', target: 'components/ui/charts/bar-chart/BarChart.tsx' },
    { path: 'index.ts', target: 'components/ui/charts/bar-chart/index.ts' },
    { path: '../useChartTheme.ts', target: 'components/ui/charts/useChartTheme.ts' },
    { path: '../shared.tsx', target: 'components/ui/charts/shared.tsx' },
  ],
  dependencies: ['echarts', 'echarts-for-react'],
  registryDependencies: [],
})

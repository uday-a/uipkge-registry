import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'range-bar-chart',
  type: 'registry:ui',
  categories: ['chart'],
  description: 'React mirror of @uipkge/range-bar-chart — see the Vue registry item for the canonical description.',
  files: [
    { path: 'RangeBarChart.tsx', target: 'components/ui/charts/range-bar-chart/RangeBarChart.tsx' },
    { path: 'index.ts', target: 'components/ui/charts/range-bar-chart/index.ts' },
    { path: '../useChartTheme.ts', target: 'components/ui/charts/useChartTheme.ts' },
    { path: '../shared.tsx', target: 'components/ui/charts/shared.tsx' },
  ],
  dependencies: ['echarts', 'echarts-for-react'],
  registryDependencies: [],
})

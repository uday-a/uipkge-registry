import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'range-area-chart',
  type: 'registry:ui',
  categories: ['chart'],
  description: 'React mirror of @uipkge/range-area-chart — see the Vue registry item for the canonical description.',
  files: [
    { path: 'RangeAreaChart.tsx', target: 'components/ui/charts/range-area-chart/RangeAreaChart.tsx' },
    { path: 'index.ts', target: 'components/ui/charts/range-area-chart/index.ts' },
    { path: '../useChartTheme.ts', target: 'components/ui/charts/useChartTheme.ts' },
    { path: '../shared.tsx', target: 'components/ui/charts/shared.tsx' },
  ],
  dependencies: ['echarts', 'echarts-for-react'],
  registryDependencies: [],
})

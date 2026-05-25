import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'stacked-area-chart',
  type: 'registry:ui',
  categories: ['chart'],
  description: 'React mirror of @uipkge/stacked-area-chart — see the Vue registry item for the canonical description.',
  files: [
    { path: 'StackedAreaChart.tsx', target: 'components/ui/charts/stacked-area-chart/StackedAreaChart.tsx' },
    { path: 'index.ts', target: 'components/ui/charts/stacked-area-chart/index.ts' },
    { path: '../useChartTheme.ts', target: 'components/ui/charts/useChartTheme.ts' },
    { path: '../shared.tsx', target: 'components/ui/charts/shared.tsx' },
  ],
  dependencies: ['echarts', 'echarts-for-react'],
  registryDependencies: [],
})

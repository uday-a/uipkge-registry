import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'waterfall-chart',
  type: 'registry:ui',
  categories: ['chart'],
  description: 'React mirror of @uipkge/waterfall-chart — see the Vue registry item for the canonical description.',
  files: [
    { path: 'WaterfallChart.tsx', target: 'components/ui/charts/waterfall-chart/WaterfallChart.tsx' },
    { path: 'index.ts', target: 'components/ui/charts/waterfall-chart/index.ts' },
    { path: '../useChartTheme.ts', target: 'components/ui/charts/useChartTheme.ts' },
    { path: '../shared.tsx', target: 'components/ui/charts/shared.tsx' },
  ],
  dependencies: ['echarts', 'echarts-for-react'],
  registryDependencies: [],
})

import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'bubble-chart',
  type: 'registry:ui',
  categories: ['chart'],
  description: 'React mirror of @uipkge/bubble-chart — see the Vue registry item for the canonical description.',
  files: [
    { path: 'BubbleChart.tsx', target: 'components/ui/charts/bubble-chart/BubbleChart.tsx' },
    { path: 'index.ts', target: 'components/ui/charts/bubble-chart/index.ts' },
    { path: '../useChartTheme.ts', target: 'components/ui/charts/useChartTheme.ts' },
    { path: '../shared.tsx', target: 'components/ui/charts/shared.tsx' },
  ],
  dependencies: ['echarts', 'echarts-for-react'],
  registryDependencies: [],
})

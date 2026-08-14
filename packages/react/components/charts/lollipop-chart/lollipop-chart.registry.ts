import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'lollipop-chart',
  type: 'registry:ui',
  categories: ['chart'],
  description: 'React mirror of @uipkge/lollipop-chart — see the Vue registry item for the canonical description.',
  files: [
    { path: 'LollipopChart.tsx', target: 'components/ui/charts/lollipop-chart/LollipopChart.tsx' },
    { path: 'index.ts', target: 'components/ui/charts/lollipop-chart/index.ts' },
    { path: '../useChartTheme.ts', target: 'components/ui/charts/useChartTheme.ts' },
    { path: '../shared.tsx', target: 'components/ui/charts/shared.tsx' },
  ],
  dependencies: ['echarts', 'echarts-for-react'],
  registryDependencies: [],
})

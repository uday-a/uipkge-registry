import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'graph-chart',
  type: 'registry:ui',
  categories: ['chart'],
  description: 'React mirror of @uipkge/graph-chart — see the Vue registry item for the canonical description.',
  files: [
    { path: 'GraphChart.tsx', target: 'components/ui/charts/graph-chart/GraphChart.tsx' },
    { path: 'index.ts', target: 'components/ui/charts/graph-chart/index.ts' },
    { path: '../useChartTheme.ts', target: 'components/ui/charts/useChartTheme.ts' },
    { path: '../shared.tsx', target: 'components/ui/charts/shared.tsx' },
  ],
  dependencies: ['echarts', 'echarts-for-react'],
  registryDependencies: [],
})

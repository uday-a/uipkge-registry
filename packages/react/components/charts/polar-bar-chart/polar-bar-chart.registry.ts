import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'polar-bar-chart',
  type: 'registry:ui',
  categories: ['chart'],
  description: 'React mirror of @uipkge/polar-bar-chart — see the Vue registry item for the canonical description.',
  files: [
    { path: 'PolarBarChart.tsx', target: 'components/ui/charts/polar-bar-chart/PolarBarChart.tsx' },
    { path: 'index.ts', target: 'components/ui/charts/polar-bar-chart/index.ts' },
    { path: '../useChartTheme.ts', target: 'components/ui/charts/useChartTheme.ts' },
    { path: '../shared.tsx', target: 'components/ui/charts/shared.tsx' },
  ],
  dependencies: ['echarts', 'echarts-for-react'],
  registryDependencies: [],
})

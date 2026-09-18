import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'slope-chart',
  type: 'registry:ui',
  categories: ['chart'],
  description: 'React mirror of @uipkge/slope-chart — see the Vue registry item for the canonical description.',
  files: [
    { path: 'SlopeChart.tsx', target: 'components/ui/charts/slope-chart/SlopeChart.tsx' },
    { path: 'index.ts', target: 'components/ui/charts/slope-chart/index.ts' },
    { path: '../useChartTheme.ts', target: 'components/ui/charts/useChartTheme.ts' },
    { path: '../shared.tsx', target: 'components/ui/charts/shared.tsx' },
  ],
  dependencies: ['echarts', 'echarts-for-react'],
  registryDependencies: [],
})

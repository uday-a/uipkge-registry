import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'radar-chart',
  type: 'registry:ui',
  categories: ['chart'],
  description: 'React mirror of @uipkge/radar-chart — see the Vue registry item for the canonical description.',
  files: [
    { path: 'RadarChart.tsx', target: 'components/ui/charts/radar-chart/RadarChart.tsx' },
    { path: 'index.ts', target: 'components/ui/charts/radar-chart/index.ts' },
    { path: '../useChartTheme.ts', target: 'components/ui/charts/useChartTheme.ts' },
    { path: '../shared.tsx', target: 'components/ui/charts/shared.tsx' },
  ],
  dependencies: ['echarts', 'echarts-for-react'],
  registryDependencies: [],
})

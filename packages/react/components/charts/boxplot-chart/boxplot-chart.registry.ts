import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'boxplot-chart',
  type: 'registry:ui',
  categories: ['chart'],
  description: 'React mirror of @uipkge/boxplot-chart — see the Vue registry item for the canonical description.',
  files: [
    { path: 'BoxplotChart.tsx', target: 'components/ui/charts/boxplot-chart/BoxplotChart.tsx' },
    { path: 'index.ts', target: 'components/ui/charts/boxplot-chart/index.ts' },
    { path: '../useChartTheme.ts', target: 'components/ui/charts/useChartTheme.ts' },
    { path: '../shared.tsx', target: 'components/ui/charts/shared.tsx' },
  ],
  dependencies: ['echarts', 'echarts-for-react'],
  registryDependencies: [],
})

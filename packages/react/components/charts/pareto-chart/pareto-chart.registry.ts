import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'pareto-chart',
  type: 'registry:ui',
  categories: ['chart'],
  description: 'React mirror of @uipkge/pareto-chart — see the Vue registry item for the canonical description.',
  files: [
    { path: 'ParetoChart.tsx', target: 'components/ui/charts/pareto-chart/ParetoChart.tsx' },
    { path: 'index.ts', target: 'components/ui/charts/pareto-chart/index.ts' },
    { path: '../useChartTheme.ts', target: 'components/ui/charts/useChartTheme.ts' },
    { path: '../shared.tsx', target: 'components/ui/charts/shared.tsx' },
  ],
  dependencies: ['echarts', 'echarts-for-react'],
  registryDependencies: [],
})

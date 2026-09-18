import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'raw-chart',
  type: 'registry:ui',
  categories: ['chart'],
  description: 'React mirror of @uipkge/raw-chart — see the Vue registry item for the canonical description.',
  files: [
    { path: 'RawChart.tsx', target: 'components/ui/charts/raw-chart/RawChart.tsx' },
    { path: 'index.ts', target: 'components/ui/charts/raw-chart/index.ts' },
    { path: '../useChartTheme.ts', target: 'components/ui/charts/useChartTheme.ts' },
    { path: '../shared.tsx', target: 'components/ui/charts/shared.tsx' },
  ],
  dependencies: ['echarts', 'echarts-for-react'],
  registryDependencies: [],
})

import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'icicle-chart',
  type: 'registry:ui',
  categories: ['chart'],
  description: 'React mirror of @uipkge/icicle-chart — see the Vue registry item for the canonical description.',
  files: [
    { path: 'IcicleChart.tsx', target: 'components/ui/charts/icicle-chart/IcicleChart.tsx' },
    { path: 'index.ts', target: 'components/ui/charts/icicle-chart/index.ts' },
    { path: '../useChartTheme.ts', target: 'components/ui/charts/useChartTheme.ts' },
    { path: '../shared.tsx', target: 'components/ui/charts/shared.tsx' },
  ],
  dependencies: ['echarts', 'echarts-for-react'],
  registryDependencies: [],
})

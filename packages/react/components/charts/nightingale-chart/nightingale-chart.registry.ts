import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'nightingale-chart',
  type: 'registry:ui',
  categories: ['chart'],
  description: 'React mirror of @uipkge/nightingale-chart — see the Vue registry item for the canonical description.',
  files: [
    { path: 'NightingaleChart.tsx', target: 'components/ui/charts/nightingale-chart/NightingaleChart.tsx' },
    { path: 'index.ts', target: 'components/ui/charts/nightingale-chart/index.ts' },
    { path: '../useChartTheme.ts', target: 'components/ui/charts/useChartTheme.ts' },
    { path: '../shared.tsx', target: 'components/ui/charts/shared.tsx' },
  ],
  dependencies: ['echarts', 'echarts-for-react'],
  registryDependencies: [],
})

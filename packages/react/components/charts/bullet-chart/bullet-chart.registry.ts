import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'bullet-chart',
  type: 'registry:ui',
  categories: ['chart'],
  description: 'React mirror of @uipkge/bullet-chart — see the Vue registry item for the canonical description.',
  files: [
    { path: 'BulletChart.tsx', target: 'components/ui/charts/bullet-chart/BulletChart.tsx' },
    { path: 'index.ts', target: 'components/ui/charts/bullet-chart/index.ts' },
    { path: '../useChartTheme.ts', target: 'components/ui/charts/useChartTheme.ts' },
    { path: '../shared.tsx', target: 'components/ui/charts/shared.tsx' },
  ],
  dependencies: ['echarts', 'echarts-for-react'],
  registryDependencies: [],
})

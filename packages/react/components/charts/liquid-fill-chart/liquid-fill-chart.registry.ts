import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'liquid-fill-chart',
  type: 'registry:ui',
  categories: ['chart'],
  description: 'React mirror of @uipkge/liquid-fill-chart — see the Vue registry item for the canonical description.',
  files: [
    { path: 'LiquidFillChart.tsx', target: 'components/ui/charts/liquid-fill-chart/LiquidFillChart.tsx' },
    { path: 'index.ts', target: 'components/ui/charts/liquid-fill-chart/index.ts' },
    { path: '../shared.tsx', target: 'components/ui/charts/shared.tsx' },
  ],
  dependencies: ['echarts', 'echarts-for-react'],
  registryDependencies: [],
})

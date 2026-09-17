import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'heatmap',
  type: 'registry:ui',
  categories: ['chart'],
  description: 'React mirror of @uipkge/heatmap — see the Vue registry item for the canonical description.',
  files: [
    { path: 'Heatmap.tsx', target: 'components/ui/charts/heatmap/Heatmap.tsx' },
    { path: 'index.ts', target: 'components/ui/charts/heatmap/index.ts' },
    { path: '../useChartTheme.ts', target: 'components/ui/charts/useChartTheme.ts' },
    { path: '../shared.tsx', target: 'components/ui/charts/shared.tsx' },
  ],
  dependencies: ['echarts', 'echarts-for-react'],
  registryDependencies: [],
})

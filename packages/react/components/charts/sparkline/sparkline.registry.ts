import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'sparkline',
  type: 'registry:ui',
  categories: ['chart'],
  description: 'React mirror of @uipkge/sparkline — see the Vue registry item for the canonical description.',
  files: [
    { path: 'Sparkline.tsx', target: 'components/ui/charts/sparkline/Sparkline.tsx' },
    { path: 'index.ts', target: 'components/ui/charts/sparkline/index.ts' },
    { path: '../useChartTheme.ts', target: 'components/ui/charts/useChartTheme.ts' },
    { path: '../shared.tsx', target: 'components/ui/charts/shared.tsx' },
  ],
  dependencies: ['echarts', 'echarts-for-react'],
  registryDependencies: [],
})

import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'marimekko-chart',
  type: 'registry:ui',
  categories: ['chart'],
  description: 'React mirror of @uipkge/marimekko-chart — see the Vue registry item for the canonical description.',
  files: [
    { path: 'MarimekkoChart.tsx', target: 'components/ui/charts/marimekko-chart/MarimekkoChart.tsx' },
    { path: 'index.ts', target: 'components/ui/charts/marimekko-chart/index.ts' },
    { path: '../useChartTheme.ts', target: 'components/ui/charts/useChartTheme.ts' },
    { path: '../shared.tsx', target: 'components/ui/charts/shared.tsx' },
  ],
  dependencies: ['echarts', 'echarts-for-react'],
  registryDependencies: [],
})

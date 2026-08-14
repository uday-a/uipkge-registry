import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'chord-chart',
  type: 'registry:ui',
  categories: ['chart'],
  description: 'React mirror of @uipkge/chord-chart — see the Vue registry item for the canonical description.',
  files: [
    { path: 'ChordChart.tsx', target: 'components/ui/charts/chord-chart/ChordChart.tsx' },
    { path: 'index.ts', target: 'components/ui/charts/chord-chart/index.ts' },
    { path: '../useChartTheme.ts', target: 'components/ui/charts/useChartTheme.ts' },
    { path: '../shared.tsx', target: 'components/ui/charts/shared.tsx' },
  ],
  dependencies: ['echarts', 'echarts-for-react'],
  registryDependencies: [],
})

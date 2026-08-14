import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'calendar-heatmap',
  type: 'registry:ui',
  categories: ['chart'],
  description: 'React mirror of @uipkge/calendar-heatmap — see the Vue registry item for the canonical description.',
  files: [
    { path: 'CalendarHeatmap.tsx', target: 'components/ui/charts/calendar-heatmap/CalendarHeatmap.tsx' },
    { path: 'index.ts', target: 'components/ui/charts/calendar-heatmap/index.ts' },
    { path: '../useChartTheme.ts', target: 'components/ui/charts/useChartTheme.ts' },
    { path: '../shared.tsx', target: 'components/ui/charts/shared.tsx' },
  ],
  dependencies: ['echarts', 'echarts-for-react'],
  registryDependencies: [],
})

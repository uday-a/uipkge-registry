import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'uptime-tracker-chart',
  type: 'registry:ui',
  categories: ['chart'],
  description:
    'React mirror of @uipkge/uptime-tracker-chart — see the Vue registry item for the canonical description.',
  files: [
    { path: 'UptimeTrackerChart.tsx', target: 'components/ui/charts/uptime-tracker-chart/UptimeTrackerChart.tsx' },
    { path: 'index.ts', target: 'components/ui/charts/uptime-tracker-chart/index.ts' },
    { path: '../shared.tsx', target: 'components/ui/charts/shared.tsx' },
  ],
  dependencies: ['echarts', 'echarts-for-react'],
  registryDependencies: [],
})

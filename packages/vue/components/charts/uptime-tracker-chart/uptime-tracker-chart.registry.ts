import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'uptime-tracker-chart',
  type: 'registry:ui',
  framework: 'vue',
  categories: ['chart'],
  description:
    'Uptime tracker as dependency-free SVG-friendly markup. 90-day style status bars with an auto-computed uptime % legend. Picks up chart tokens via CSS variables.',
  files: [
    { path: 'UptimeTrackerChart.vue', target: 'components/ui/charts/uptime-tracker-chart/UptimeTrackerChart.vue' },
    { path: 'index.ts', target: 'components/ui/charts/uptime-tracker-chart/index.ts' },
  ],
  dependencies: [],
  registryDependencies: [],
})

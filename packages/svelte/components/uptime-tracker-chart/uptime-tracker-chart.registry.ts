import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'uptime-tracker-chart',
  type: 'registry:ui',
  framework: 'svelte',
  categories: ['chart'],
  description:
    'Uptime tracker as dependency-free SVG-friendly markup. 90-day style status bars with an auto-computed uptime % legend. Picks up chart tokens via CSS variables.',
  files: [
    { path: 'UptimeTrackerChart.svelte', target: 'components/ui/uptime-tracker-chart/UptimeTrackerChart.svelte' },
    { path: 'index.ts', target: 'components/ui/uptime-tracker-chart/index.ts' },
  ],
  dependencies: [],
  registryDependencies: [],
})

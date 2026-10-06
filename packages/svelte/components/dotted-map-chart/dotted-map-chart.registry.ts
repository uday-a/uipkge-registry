import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'dotted-map-chart',
  type: 'registry:ui',
  framework: 'svelte',
  categories: ['chart'],
  description:
    'Dotted map with telemetry pins and connection routes over a dot-matrix landmass. Globe/mercator projection toggle, pulsing pins with hover detail cards, and world/USA grids. Built on the map primitive.',
  files: [
    { path: 'DottedMapChart.svelte', target: 'components/ui/dotted-map-chart/DottedMapChart.svelte' },
    { path: 'index.ts', target: 'components/ui/dotted-map-chart/index.ts' },
  ],
  dependencies: ['@lucide/svelte'],
  registryDependencies: ['https://uipkge.dev/r/map.json'],
})

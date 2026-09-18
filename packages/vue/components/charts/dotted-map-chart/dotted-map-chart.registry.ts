import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'dotted-map-chart',
  type: 'registry:ui',
  framework: 'vue',
  categories: ['chart'],
  description:
    'Dotted map as dependency-free SVG. Embedded world (96×48) and USA (155×74) landmasks with cartographic AK/HI insets rasterized from Natural Earth/US outlines; lat/lng pins with pulse, vertical/diagonal grids, circle/hexagon dots. No map tokens or geodata fetches.',
  files: [
    { path: 'DottedMapChart.vue', target: 'components/ui/charts/dotted-map-chart/DottedMapChart.vue' },
    { path: 'index.ts', target: 'components/ui/charts/dotted-map-chart/index.ts' },
  ],
  dependencies: ['lucide-vue-next'],
  registryDependencies: ['https://uipkge.dev/r/map.json'],
})

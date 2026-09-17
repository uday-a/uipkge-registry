import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'vector-map',
  type: 'registry:ui',
  framework: 'vue',
  categories: ['chart'],
  description:
    'Pure dependency-free SVG world landmass vector map. Features high-resolution continental paths (North America, South America, Europe, Africa, Asia, Oceania, UK, Japan) with region data shading, interactive pulsing pins, curved flight routes, and rich telemetry hover popovers.',
  files: [
    { path: 'VectorMap.vue', target: 'components/ui/charts/vector-map/VectorMap.vue' },
    { path: 'index.ts', target: 'components/ui/charts/vector-map/index.ts' },
  ],
  dependencies: ['mapbox-gl', '@studiometa/vue-mapbox-gl', 'lucide-vue-next'],
  registryDependencies: ['https://uipkge.dev/r/map.json'],
})

import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'vector-map',
  type: 'registry:ui',
  framework: 'svelte',
  categories: ['chart'],
  description:
    'Pure dependency-free SVG world landmass vector map. Features high-resolution continental paths (North America, South America, Europe, Africa, Asia, Oceania, UK, Japan) with region data shading, interactive pulsing pins, curved flight routes, and rich telemetry hover popovers.',
  files: [
    { path: 'VectorMap.svelte', target: 'components/ui/vector-map/VectorMap.svelte' },
    { path: 'index.ts', target: 'components/ui/vector-map/index.ts' },
  ],
  dependencies: ['@lucide/svelte'],
  registryDependencies: ['https://uipkge.dev/r/map.json'],
})

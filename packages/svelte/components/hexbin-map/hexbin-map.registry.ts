import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'hexbin-map',
  type: 'registry:ui',
  categories: ['chart'],
  framework: 'svelte',
  description:
    'US 50 states + DC hexbin cartogram chart rendered as pure dependency-free SVG. Pointy-top hexagonal grid with automatic color scale ramps, state abbreviation labels, metric values, interactive hover tooltips, and keyboard-accessible state selection.',
  files: [
    { path: 'HexbinMap.svelte', target: 'components/ui/hexbin-map/HexbinMap.svelte' },
    { path: 'index.ts', target: 'components/ui/hexbin-map/index.ts' },
  ],
  dependencies: ['@lucide/svelte'],
  registryDependencies: ['https://uipkge.dev/r/map.json'],
})

import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'hexbin-map',
  type: 'registry:ui',
  categories: ['chart'],
  description: 'React mirror of @uipkge/hexbin-map — see the Vue registry item for the canonical description.',
  files: [
    { path: 'HexbinMap.tsx', target: 'components/ui/charts/hexbin-map/HexbinMap.tsx' },
    { path: 'index.ts', target: 'components/ui/charts/hexbin-map/index.ts' },
  ],
  dependencies: ['lucide-react'],
  registryDependencies: ['https://uipkge.dev/r/map.json'],
})

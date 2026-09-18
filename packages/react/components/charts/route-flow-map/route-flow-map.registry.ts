import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'route-flow-map',
  type: 'registry:ui',
  categories: ['chart'],
  description: 'React mirror of @uipkge/route-flow-map — see the Vue registry item for the canonical description.',
  files: [
    { path: 'RouteFlowMap.tsx', target: 'components/ui/charts/route-flow-map/RouteFlowMap.tsx' },
    { path: 'index.ts', target: 'components/ui/charts/route-flow-map/index.ts' },
  ],
  dependencies: ['lucide-react'],
  registryDependencies: ['https://uipkge.dev/r/map.json'],
})

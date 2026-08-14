import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'sales-territory-map',
  type: 'registry:block',
  categories: ['analytics', 'dashboard'],
  description: 'Sales territory map. Region pins with quota attainment; select a territory to fly the camera.',
  framework: 'react',
  files: [{ path: 'SalesTerritoryMap.tsx', target: 'components/blocks/SalesTerritoryMap.tsx' }],
  dependencies: [],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/map.json',
  ],
})

import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'fleet-vehicle-map',
  type: 'registry:block',
  categories: ['logistics', 'app', 'dashboard'],
  description: 'Live fleet map with vehicle markers. Select a unit to fly the camera and read status.',
  framework: 'react',
  files: [{ path: 'FleetVehicleMap.tsx', target: 'components/blocks/FleetVehicleMap.tsx' }],
  dependencies: [],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/map.json',
  ],
})

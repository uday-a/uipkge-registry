import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'property-boundary-map',
  type: 'registry:block',
  categories: ['real-estate', 'places', 'map'],
  description: 'Cadastral parcel boundaries with zoning classifications, lot acreage, and tax assessment valuation.',
  framework: 'react',
  files: [{ path: 'PropertyBoundaryMap.tsx', target: 'components/blocks/PropertyBoundaryMap.tsx' }],
  dependencies: [],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/map.json',
  ],
})

import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'property-amenities-grid',
  type: 'registry:block',
  categories: ['real-estate', 'hospitality', 'marketing'],
  description:
    'Building and luxury residential amenities matrix featuring categorized lifestyle zones, interactive category tabs, instant keyword search, and detailed feature cards with pool photography thumbnail.',
  files: [{ path: 'PropertyAmenitiesGrid.tsx', target: 'components/blocks/PropertyAmenitiesGrid.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/separator.json',
  ],
})

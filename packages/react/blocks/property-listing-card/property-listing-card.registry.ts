import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'property-listing-card',
  type: 'registry:block',
  categories: ['real-estate', 'hospitality', 'marketing', 'ecommerce'],
  description:
    'Zillow and Redfin style real estate property listing card featuring interactive photo carousels with 16:9 aspect ratios, price and mortgage estimation, specification pills (beds, baths, square footage, price/sqft), address, key feature tags, listing agent attribution, and direct tour scheduling actions.',
  framework: 'react',
  files: [{ path: 'PropertyListingCard.tsx', target: 'components/blocks/PropertyListingCard.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/avatar.json',
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/separator.json',
  ],
})

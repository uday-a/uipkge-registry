import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'category-showcase',
  type: 'registry:block',
  categories: ['commerce', 'ecommerce', 'marketing'],
  description:
    'E-commerce category bento grid and featured collections showcase with interactive hover zoom effects, promo sale banner, and bento or uniform grid layouts.',
  files: [{ path: 'CategoryShowcase.tsx', target: 'components/blocks/CategoryShowcase.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
  ],
})

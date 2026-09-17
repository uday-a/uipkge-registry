import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'frequently-bought-together',
  type: 'registry:block',
  categories: ['commerce', 'ecommerce'],
  description:
    'E-commerce frequently bought together bundle builder with interactive product preview cards, checkbox selection, dynamic bundle discount calculation, and one-click cart checkout.',
  files: [{ path: 'FrequentlyBoughtTogether.tsx', target: 'components/blocks/FrequentlyBoughtTogether.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/checkbox.json',
  ],
})

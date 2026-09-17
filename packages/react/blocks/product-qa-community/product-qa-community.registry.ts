import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'product-qa-community',
  type: 'registry:block',
  categories: ['ecommerce', 'marketing'],
  framework: 'react',
  description:
    'Searchable customer and engineering Q&A community forum with staff answer badges, question upvoting, category filters, and live ask modal.',
  files: [
    { path: 'ProductQaCommunity.tsx', target: 'components/blocks/product-qa-community/ProductQaCommunity.tsx' },
    { path: 'index.ts', target: 'components/blocks/product-qa-community/index.ts' },
  ],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/input.json',
    'https://uipkge.dev/r/textarea.json',
  ],
})

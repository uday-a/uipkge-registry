import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'product-detail-page',
  type: 'registry:block',
  categories: ['commerce', 'ecommerce'],
  description:
    'Flagship e-commerce product detail page with multi-angle gallery, finish & cable selectors, stock urgency counter, warranty upsell, flash sale countdown bar, frequently bought together bundle, technical specs sheet, customer reviews breakdown, and community Q&A.',
  framework: 'react',
  files: [{ path: 'ProductDetailPage.tsx', target: 'components/blocks/ProductDetailPage.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/input.json',
    'https://uipkge.dev/r/progress.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/table.json',
    'https://uipkge.dev/r/tabs.json',
    'https://uipkge.dev/r/flash-sale-offer-bar.json',
    'https://uipkge.dev/r/frequently-bought-together.json',
    'https://uipkge.dev/r/technical-specs-sheet.json',
    'https://uipkge.dev/r/customer-reviews.json',
    'https://uipkge.dev/r/product-qa-community.json',
  ],
})

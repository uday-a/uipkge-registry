import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'product-grid-page',
  type: 'registry:block',
  categories: ['commerce', 'ecommerce'],
  description:
    'E-commerce product listing page (PLP) featuring breadcrumb navigation, category header with sorting and mobile filter drawer, a 2-column layout with a multi-facet sidebar (categories, price range slider, color swatches, brands, ratings), and a responsive 3-column product grid with image hover zoom, badges, wishlist toggle, color swatches, quick add to cart, and pagination.',
  framework: 'vue',
  files: [{ path: 'ProductGridPage.vue', target: 'components/blocks/ProductGridPage.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/breadcrumb.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/checkbox.json',
    'https://uipkge.dev/r/select.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/sheet.json',
    'https://uipkge.dev/r/slider.json',
  ],
})

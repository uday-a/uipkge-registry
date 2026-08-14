import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'logo-cloud-categorized-grid',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Categorized 4-industry logo & enterprise customer workbench with scale metrics, category filter tabs, and full testimonial modal inspect.',
  framework: 'vue',
  files: [{ path: 'LogoCloudCategorizedGrid.vue', target: 'components/blocks/LogoCloudCategorizedGrid.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
  ],
})

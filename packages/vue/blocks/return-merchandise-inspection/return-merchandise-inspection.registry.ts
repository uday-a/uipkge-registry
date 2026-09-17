import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'return-merchandise-inspection',
  type: 'registry:block',
  categories: ['logistics', 'ecommerce', 'app'],
  description:
    'Warehouse returns intake inspection station, RMA condition grading, and restock vs quarantine disposition workbench.',
  framework: 'vue',
  files: [
    {
      path: 'ReturnMerchandiseInspection.vue',
      target: 'components/blocks/ReturnMerchandiseInspection.vue',
    },
  ],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/checkbox.json',
    'https://uipkge.dev/r/radio-group.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/textarea.json',
  ],
})

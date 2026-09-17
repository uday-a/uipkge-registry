import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'customs-clearance-tracker',
  type: 'registry:block',
  categories: ['logistics', 'ecommerce', 'dashboard'],
  description:
    'International import/export customs declaration tracker featuring CBP Form 7501 reference, 5-stage clearance progression stepper, tariff and regulatory fee breakdown (MPF/HMF), and HTSUS declared commodity line items table.',
  framework: 'vue',
  files: [{ path: 'CustomsClearanceTracker.vue', target: 'components/blocks/CustomsClearanceTracker.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/table.json',
  ],
})

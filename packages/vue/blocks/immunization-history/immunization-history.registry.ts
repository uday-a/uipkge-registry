import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'immunization-history',
  type: 'registry:block',
  categories: ['healthcare', 'app'],
  description:
    'Digital vaccine record passport and clinical immunization history: SMART Health Card verifiable credential with cryptographic signature, active protection summary chips, detailed CDC/WHO vaccine administration table with CVX codes and lot tracking, and travel health advisory alerts.',
  framework: 'vue',
  files: [{ path: 'ImmunizationHistory.vue', target: 'components/blocks/ImmunizationHistory.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/table.json',
  ],
})

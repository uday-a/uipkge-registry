import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'nda-agreement-generator',
  type: 'registry:block',
  categories: ['legal', 'finance', 'app'],
  framework: 'vue',
  description:
    'Interactive Non-Disclosure Agreement (NDA) generator and contract customizer with bilateral/unilateral modes, customizable legal covenants, real-time contract parchment preview, and e-signature execution workflow.',
  files: [{ path: 'NdaAgreementGenerator.vue', target: 'components/blocks/NdaAgreementGenerator.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/input.json',
    'https://uipkge.dev/r/radio-group.json',
    'https://uipkge.dev/r/select.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/switch.json',
  ],
})

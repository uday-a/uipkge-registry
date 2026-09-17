import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'privacy-policy-generator',
  type: 'registry:block',
  categories: ['legal', 'marketing', 'app', 'form'],
  framework: 'vue',
  description:
    'Customizable website privacy policy builder with third-party tracking disclosures, CCPA, and GDPR compliance clauses.',
  files: [{ path: 'PrivacyPolicyGenerator.vue', target: 'components/blocks/PrivacyPolicyGenerator.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/checkbox.json',
    'https://uipkge.dev/r/input.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/switch.json',
  ],
})

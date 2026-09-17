import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'legal-policy-page',
  type: 'registry:block',
  categories: ['legal', 'marketing'],
  description:
    'Privacy Policy and legal documentation layout with top metadata header, version switcher, sticky table of contents navigation, and structured compliance sections for GDPR and CCPA.',
  files: [{ path: 'LegalPolicyPage.tsx', target: 'components/blocks/LegalPolicyPage.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/select.json',
    'https://uipkge.dev/r/separator.json',
  ],
})

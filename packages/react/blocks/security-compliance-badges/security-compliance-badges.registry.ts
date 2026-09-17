import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'security-compliance-badges',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Enterprise security and compliance workbench featuring SOC2, ISO27001, GDPR, and HIPAA audit inspection, cryptographic SHA-256 fingerprint verification, and whitepaper download.',
  files: [{ path: 'SecurityComplianceBadges.tsx', target: 'components/blocks/SecurityComplianceBadges.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
  ],
})

import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'lease-agreement-sign',
  type: 'registry:block',
  categories: ['real-estate', 'hospitality', 'app'],
  description:
    'DocuSign-style digital residential lease agreement signature and review workflow with terms summary, interactive initial checkpoints, sticky signature action sidebar, and cryptographic audit execution.',
  files: [{ path: 'LeaseAgreementSign.tsx', target: 'components/blocks/LeaseAgreementSign.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/separator.json',
  ],
})

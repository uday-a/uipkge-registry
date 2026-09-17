import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'certificate-credential-card',
  type: 'registry:block',
  categories: ['education', 'app', 'card'],
  description:
    'Digital diploma and verified credential card featuring ornamental certificate container, cryptographic seal with QR code verification, recipient honors, validated skill pills, instructor signatures, and social sharing.',
  files: [{ path: 'CertificateCredentialCard.tsx', target: 'components/blocks/CertificateCredentialCard.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/separator.json',
  ],
})

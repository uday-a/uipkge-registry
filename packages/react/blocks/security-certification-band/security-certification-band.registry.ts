import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'security-certification-band',
  title: 'Security — Certification Band',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Slim compliance band listing each certification with its issuing body and last audit date, plus a data residency selector, for placing above a pricing table.',
  files: [{ path: 'SecurityCertificationBand.tsx', target: 'components/blocks/SecurityCertificationBand.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/select.json',
    'https://uipkge.dev/r/separator.json',
  ],
})

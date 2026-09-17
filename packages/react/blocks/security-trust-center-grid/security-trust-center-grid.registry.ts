import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'security-trust-center-grid',
  title: 'Security — Trust Centre Grid',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Trust centre surface pairing compliance programmes with their audit date, scope, and report link, over a row of operational controls stated as facts rather than claims.',
  files: [{ path: 'SecurityTrustCenterGrid.tsx', target: 'components/blocks/SecurityTrustCenterGrid.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/separator.json',
  ],
})

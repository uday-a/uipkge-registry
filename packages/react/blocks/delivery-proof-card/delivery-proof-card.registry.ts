import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'delivery-proof-card',
  type: 'registry:block',
  categories: ['logistics', 'app', 'ecommerce'],
  description:
    'Last-mile Electronic Proof of Delivery (ePOD) receipt featuring customer signature canvas readout, high-contrast drop-off photo with GPS geostamp HUD overlay, recipient & courier metadata, and itemized package manifest.',
  files: [{ path: 'DeliveryProofCard.tsx', target: 'components/blocks/DeliveryProofCard.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/avatar.json',
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/table.json',
  ],
})

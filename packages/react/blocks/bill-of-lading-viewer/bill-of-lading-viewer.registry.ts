import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'bill-of-lading-viewer',
  type: 'registry:block',
  categories: ['logistics', 'app', 'documents'],
  description:
    'Maritime & Air Bill of Lading (BOL) shipping document viewer and customs compliance inspector with multi-party entity grid, transport routing, container & cargo manifest, freight terms, carrier stamp, and blockchain verification.',
  files: [{ path: 'BillOfLadingViewer.tsx', target: 'components/blocks/BillOfLadingViewer.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/table.json',
  ],
})

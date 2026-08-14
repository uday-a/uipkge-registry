import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'prescription-refill-manager',
  type: 'registry:block',
  categories: ['healthcare', 'app'],
  description:
    'Pharmacy patient portal for managing active prescriptions, refill requests, dosage schedules, delivery tracking, and preferred pharmacy details with an integrated refill order dialog.',
  framework: 'react',
  files: [{ path: 'PrescriptionRefillManager.tsx', target: 'components/blocks/PrescriptionRefillManager.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/dialog.json',
    'https://uipkge.dev/r/dropdown-menu.json',
    'https://uipkge.dev/r/radio-group.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/table.json',
  ],
})

import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'invoice-creator-wizard',
  type: 'registry:block',
  categories: ['finance', 'app', 'billing', 'form'],
  description:
    'Square/Stripe-style interactive invoice builder with itemized tax, discount calculation, dynamic line items, client presets, and a real-time paper document preview.',
  files: [{ path: 'InvoiceCreatorWizard.tsx', target: 'components/blocks/InvoiceCreatorWizard.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/input.json',
    'https://uipkge.dev/r/select.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/table.json',
    'https://uipkge.dev/r/textarea.json',
  ],
})

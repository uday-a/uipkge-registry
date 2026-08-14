import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'returns-portal',
  type: 'registry:block',
  categories: ['commerce', 'ecommerce', 'app'],
  description:
    'Self-serve e-commerce returns & exchange portal wizard: Stepper header (Find Order → Select Items → Choose Resolution → Confirm & Print Label), order lookup with email and order number, item selection list with return reasons and quantities, resolution selector (size exchange, store credit with +10% bonus, or original payment refund), and confirmation screen with printable prepaid shipping label, QR code drop-off instructions, and return summary.',
  files: [{ path: 'ReturnsPortal.tsx', target: 'components/blocks/ReturnsPortal.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/checkbox.json',
    'https://uipkge.dev/r/input.json',
    'https://uipkge.dev/r/radio-group.json',
    'https://uipkge.dev/r/select.json',
    'https://uipkge.dev/r/stepper.json',
  ],
})

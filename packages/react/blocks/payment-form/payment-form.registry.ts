import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'payment-form',
  type: 'registry:block',
  categories: ['commerce'],
  description:
    'Credit-card checkout form with a live 3D card preview, wallet shortcut buttons (Apple Pay / Google Pay / PayPal), brand auto-detection, Luhn validation, expiry / CVC checks, and a hookable async submit. Wallet buttons call `onWallet` so the consumer wires the actual SDK; the card form calls `onSuccess` / `onError` after the consumer-provided `onSubmit` settles.',
  files: [{ path: 'PaymentForm.tsx', target: 'components/blocks/PaymentForm.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/payment-card.json',
    'https://uipkge.dev/r/input.json',
    'https://uipkge.dev/r/label.json',
    'https://uipkge.dev/r/button.json',
  ],
})

import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'payment-form',
  type: 'registry:block',
  framework: 'vue',
  categories: ['commerce'],
  description:
    'Credit-card checkout form with a live 3D card preview, wallet shortcut buttons (Apple Pay / Google Pay / PayPal), brand auto-detection, Luhn validation, expiry / CVC checks, and a hookable async submit. Wallet buttons emit a `wallet` event so the consumer wires the actual SDK; the card form emits `success` / `error` after the consumer-provided `onSubmit` settles.',
  files: [{ path: 'PaymentForm.vue', target: 'components/blocks/PaymentForm.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/payment-card.json',
    'https://uipkge.dev/r/input.json',
    'https://uipkge.dev/r/label.json',
    'https://uipkge.dev/r/button.json',
  ],
})

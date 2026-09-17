import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'checkout-flow',
  type: 'registry:block',
  framework: 'vue',
  categories: ['commerce'],
  description:
    'Three-step checkout (cart → payment → confirm) with animated step transitions, an inline PaymentForm, a success screen that fires a confetti burst with an animated checkmark, and an error screen with retry. Async submit is forwarded to the consumer-provided `onSubmit`, which returns an `orderId` that ends up on the success screen.',
  files: [{ path: 'CheckoutFlow.vue', target: 'components/blocks/CheckoutFlow.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/payment-card.json',
    'https://uipkge.dev/r/payment-form.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/input.json',
    'https://uipkge.dev/r/label.json',
    'https://uipkge.dev/r/stepper.json',
    'https://uipkge.dev/r/separator.json',
  ],
})

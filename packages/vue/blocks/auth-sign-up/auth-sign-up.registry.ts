import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'auth-sign-up',
  type: 'registry:block',
  categories: ['auth'],
  description:
    'Full-page sign-up surface. Name/email/password/confirm form with password-match validation, T&C acceptance gate, optional OAuth row, link back to sign-in. Emits `submit` with the validated payload and `oauth` with provider; consumer wires the actual auth call.',
  framework: 'vue',
  files: [{ path: 'AuthSignUp.vue', target: 'components/blocks/AuthSignUp.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/input.json',
    'https://uipkge.dev/r/label.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/checkbox.json',
    'https://uipkge.dev/r/separator.json',
  ],
})

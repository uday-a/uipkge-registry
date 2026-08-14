import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'auth-sign-in',
  type: 'registry:block',
  categories: ['auth'],
  description:
    'Full-page sign-in surface. Email + password + remember-me form, forgot-password and sign-up links, optional GitHub/Google OAuth row. Emits `submit` with the form payload and `oauth` with the chosen provider; consumer wires the actual auth call. Link targets are configurable via props.',
  framework: 'vue',
  files: [{ path: 'AuthSignIn.vue', target: 'components/blocks/AuthSignIn.vue' }],
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

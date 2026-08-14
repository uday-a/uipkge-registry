import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'login-02',
  title: 'Split Brand Login',
  type: 'registry:block',
  categories: ['auth'],
  description:
    'Split-layout login. Brand/marketing panel on the left (logo, headline, value-prop bullets, copyright) and the form on the right (email + password, SSO row, sign-up link). Collapses to single-column form-only on small screens. Edit the brand panel inline to swap product copy + bullet icons.',
  framework: 'vue',
  files: [{ path: 'Login02.vue', target: 'components/blocks/Login02.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/input.json',
    'https://uipkge.dev/r/label.json',
    'https://uipkge.dev/r/separator.json',
  ],
})

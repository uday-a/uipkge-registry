import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'cookie-consent-bar',
  title: 'Cookie Consent — Bar',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Bottom consent bar offering accept, reject, and manage as equally weighted actions, with a one-line statement of what is actually stored.',
  framework: 'vue',
  files: [{ path: 'CookieConsentBar.vue', target: 'components/blocks/CookieConsentBar.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/separator.json',
  ],
})

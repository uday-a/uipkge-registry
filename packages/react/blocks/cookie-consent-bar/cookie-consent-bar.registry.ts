import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'cookie-consent-bar',
  title: 'Cookie Consent — Bar',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Bottom consent bar offering accept, reject, and manage as equally weighted actions, with a one-line statement of what is actually stored.',
  files: [{ path: 'CookieConsentBar.tsx', target: 'components/blocks/CookieConsentBar.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/separator.json',
  ],
})

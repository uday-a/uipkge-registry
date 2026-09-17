import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'cookie-consent-banner',
  type: 'registry:block',
  categories: ['legal', 'marketing', 'feedback'],
  description:
    'GDPR-style cookie consent banner with two variants: a full-width bottom bar and a compact card. Customize expands inline preferences with Necessary (always on), Analytics, and Marketing switches. Accept, Reject, and Save dismiss with a 150ms fade.',
  files: [{ path: 'CookieConsentBanner.tsx', target: 'components/blocks/CookieConsentBanner.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/switch.json',
    'https://uipkge.dev/r/separator.json',
  ],
})

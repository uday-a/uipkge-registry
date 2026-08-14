import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'register-01',
  title: 'SSO Registration Card',
  type: 'registry:block',
  categories: ['auth'],
  description:
    'Centered sign-up card. Name + email + password + confirm with inline mismatch warning, terms checkbox gating the submit, divider, and a 2-button SSO row (Google + GitHub). Footer links back to sign-in. Emits submit, sign-in, oauth, view-terms, view-privacy.',
  files: [{ path: 'Register01.tsx', target: 'components/blocks/Register01.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/checkbox.json',
    'https://uipkge.dev/r/input.json',
    'https://uipkge.dev/r/label.json',
    'https://uipkge.dev/r/separator.json',
  ],
})

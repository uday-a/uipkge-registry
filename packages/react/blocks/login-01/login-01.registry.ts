import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'login-01',
  title: 'Console SSO Login',
  type: 'registry:block',
  categories: ['auth'],
  description:
    'Split-screen developer console authentication suite featuring brand telemetry showcases, OAuth providers, passkey biometric sign-in, and automatic enterprise SAML SSO domain detection.',
  framework: 'react',
  files: [{ path: 'Login01.tsx', target: 'components/blocks/Login01.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/input.json',
    'https://uipkge.dev/r/label.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/tabs.json',
  ],
})

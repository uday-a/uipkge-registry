import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'session-device-manager',
  type: 'registry:block',
  categories: ['security', 'app', 'dashboard'],
  description:
    'Active multi-device login sessions manager and security dashboard featuring current session hero card with IP geolocation, suspicious new login alert banner, 2FA verification badges, and instant individual or bulk session revocation for desktop, mobile, and CLI tokens.',
  files: [{ path: 'SessionDeviceManager.tsx', target: 'components/blocks/SessionDeviceManager.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/separator.json',
  ],
})

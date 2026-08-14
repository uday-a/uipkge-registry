import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'virtual-card-manager',
  type: 'registry:block',
  categories: ['finance', 'app', 'billing'],
  description:
    'Mercury/Ramp-style corporate virtual card manager: interactive dark credit card visual hero with EMV chip, revealable credentials, live spending limit progress bar, instant freeze toggles, limit adjusters, and an active virtual cards table.',
  framework: 'react',
  files: [{ path: 'VirtualCardManager.tsx', target: 'components/blocks/VirtualCardManager.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/avatar.json',
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/progress.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/switch.json',
  ],
})

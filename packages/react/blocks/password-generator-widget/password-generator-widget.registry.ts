import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'password-generator-widget',
  type: 'registry:block',
  categories: ['security', 'auth', 'app'],
  description:
    '1Password and Bitwarden-style customizable password and passphrase generator with entropy strength meter, character type toggles, memorable Diceware passphrases, PIN codes, and volatile history drawer.',
  files: [{ path: 'PasswordGeneratorWidget.tsx', target: 'components/blocks/PasswordGeneratorWidget.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/slider.json',
    'https://uipkge.dev/r/switch.json',
    'https://uipkge.dev/r/tabs.json',
  ],
})

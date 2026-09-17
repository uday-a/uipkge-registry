import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'press-kit-brand-assets',
  type: 'registry:block',
  categories: ['marketing', 'brand', 'media'],
  description:
    'Comprehensive brand guidelines and press kit hub with official logo downloads in vector SVG/4K PNG/WebP, OKLCH brand palette tokens, executive leadership headshots (300 DPI), and press contact resources.',
  files: [{ path: 'PressKitBrandAssets.tsx', target: 'components/blocks/PressKitBrandAssets.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/avatar.json',
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/separator.json',
  ],
})

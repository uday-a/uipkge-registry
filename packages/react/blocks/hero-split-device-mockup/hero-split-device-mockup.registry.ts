import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'hero-split-device-mockup',
  type: 'registry:block',
  categories: ['hero', 'marketing'],
  framework: 'react',
  description:
    'Dual viewport device mockup hero with interactive viewport controls and real-time state synchronization.',
  files: [
    {
      path: 'HeroSplitDeviceMockup.tsx',
      target: 'components/blocks/hero-split-device-mockup/HeroSplitDeviceMockup.tsx',
    },
    { path: 'index.ts', target: 'components/blocks/hero-split-device-mockup/index.ts' },
  ],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/utils.json',
  ],
})

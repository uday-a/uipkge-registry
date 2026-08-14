import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'cta-gradient-glow-action',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Conversion call-to-action block with ambient atmospheric radial glow, multi-package manager terminal installation strip, and open source trust assurances.',
  files: [{ path: 'CtaGradientGlowAction.tsx', target: 'components/blocks/CtaGradientGlowAction.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
  ],
})

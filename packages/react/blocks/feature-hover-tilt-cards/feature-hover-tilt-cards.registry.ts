import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'feature-hover-tilt-cards',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    '3D perspective tilt workbench cards with dynamic mouse tracking, interactive token efficiency sliders, spring impulse testing, and dual-framework parity inspect.',
  files: [{ path: 'FeatureHoverTiltCards.tsx', target: 'components/blocks/FeatureHoverTiltCards.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
  ],
})

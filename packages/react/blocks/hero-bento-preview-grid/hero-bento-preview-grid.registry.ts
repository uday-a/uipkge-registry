import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'hero-bento-preview-grid',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Asymmetric 3-column bento hero section with interactive OKLCH palette customizer, dual-framework parity toggle, bundle bloat calculator, and edge latency telemetry.',
  files: [{ path: 'HeroBentoPreviewGrid.tsx', target: 'components/blocks/HeroBentoPreviewGrid.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
  ],
})

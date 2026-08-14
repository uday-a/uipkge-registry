import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'bento-asymmetric-grid',
  title: 'Bento — Asymmetric Grid',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Asymmetric bento where one tall tile anchors the composition and three shorter tiles carry a headline metric, a budget breakdown, and a customer quote.',
  files: [{ path: 'BentoAsymmetricGrid.tsx', target: 'components/blocks/BentoAsymmetricGrid.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/progress.json',
    'https://uipkge.dev/r/separator.json',
  ],
})

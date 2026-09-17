import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'logos-03',
  title: 'Tri-Row Marquee Logos',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Three-row logo marquee with alternating scroll directions and slightly different speeds (32s left, 26s right, 38s left) so the eye does not lock onto a single rhythm. Edges fade out via CSS mask-image; the whole section pauses on hover; respects prefers-reduced-motion.',
  files: [{ path: 'Logos03.tsx', target: 'components/blocks/Logos03.tsx' }],
  dependencies: [],
  registryDependencies: [],
})

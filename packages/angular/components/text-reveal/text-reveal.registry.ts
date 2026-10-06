import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'text-reveal',
  type: 'registry:ui',
  categories: ['display', 'motion'],
  framework: 'angular',
  description:
    'Scroll-triggered staggered entrance for text — each word or character fades in, rises and un-blurs with a per-index delay. IntersectionObserver based, once toggle for replay-on-scroll, honors prefers-reduced-motion.',
  files: [
    { path: 'text-reveal.component.ts', target: 'components/ui/text-reveal/text-reveal.component.ts' },
    { path: 'index.ts', target: 'components/ui/text-reveal/index.ts' },
  ],
  dependencies: [],
  registryDependencies: [],
})

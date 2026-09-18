import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'marquee',
  type: 'registry:ui',
  categories: ['display'],
  framework: 'vue',
  description:
    'Continuously auto-scrolling content. Scrolls horizontally or vertically in any direction, with configurable speed, gap, repeat count for a seamless loop, pause-on-hover, and a hard pause prop. Respects prefers-reduced-motion.',
  files: [
    { path: 'Marquee.vue', target: 'components/ui/marquee/Marquee.vue' },
    { path: 'index.ts', target: 'components/ui/marquee/index.ts' },
  ],
  dependencies: [],
  registryDependencies: [],
})

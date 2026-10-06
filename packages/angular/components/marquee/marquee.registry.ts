import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'marquee',
  type: 'registry:ui',
  categories: ['display'],
  framework: 'angular',
  description:
    'Continuously auto-scrolling content. Scrolls horizontally or vertically in any direction, with configurable speed, gap, repeat count for a seamless loop, pause-on-hover, and a hard pause prop. Respects prefers-reduced-motion.',
  files: [
    { path: 'marquee.component.ts', target: 'components/ui/marquee/marquee.component.ts' },
    { path: 'index.ts', target: 'components/ui/marquee/index.ts' },
  ],
  dependencies: [],
  registryDependencies: ['https://uipkge.dev/r/popper.json'],
})

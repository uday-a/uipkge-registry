import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'carousel',
  type: 'registry:ui',
  categories: ['data-display'],
  framework: 'angular',
  description:
    'Horizontal or vertical scroller with previous/next controls. Hand-rolled `useCarousel` composable backed by native CSS scroll-snap — no external carousel library, just the browser. Drop in images, cards, or any custom slide content.',
  files: [
    { path: 'carousel.component.ts', target: 'components/ui/carousel/carousel.component.ts' },
    { path: 'carousel.variants.ts', target: 'components/ui/carousel/carousel.variants.ts' },
    { path: 'index.ts', target: 'components/ui/carousel/index.ts' },
  ],
  dependencies: ['class-variance-authority'],
  registryDependencies: ['https://uipkge.dev/r/button.json'],
})

import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'carousel',
  type: 'registry:ui',
  categories: ['data-display'],
  framework: 'vue',
  description:
    'Horizontal or vertical scroller with previous/next controls. Hand-rolled `useCarousel` composable backed by native CSS scroll-snap — no external carousel library, just the browser. Drop in images, cards, or any custom slide content.',
  files: [
    { path: 'Carousel.vue', target: 'components/ui/carousel/Carousel.vue' },
    { path: 'CarouselContent.vue', target: 'components/ui/carousel/CarouselContent.vue' },
    { path: 'CarouselFooter.vue', target: 'components/ui/carousel/CarouselFooter.vue' },
    { path: 'CarouselHeader.vue', target: 'components/ui/carousel/CarouselHeader.vue' },
    { path: 'CarouselIndicators.vue', target: 'components/ui/carousel/CarouselIndicators.vue' },
    { path: 'CarouselItem.vue', target: 'components/ui/carousel/CarouselItem.vue' },
    { path: 'CarouselNext.vue', target: 'components/ui/carousel/CarouselNext.vue' },
    { path: 'CarouselPrevious.vue', target: 'components/ui/carousel/CarouselPrevious.vue' },
    { path: 'carousel.variants.ts', target: 'components/ui/carousel/carousel.variants.ts' },
    { path: 'useCarousel.ts', target: 'components/ui/carousel/useCarousel.ts' },
    { path: 'index.ts', target: 'components/ui/carousel/index.ts' },
  ],
  dependencies: ['class-variance-authority', 'lucide-vue-next'],
  registryDependencies: ['https://uipkge.dev/r/button.json'],
})

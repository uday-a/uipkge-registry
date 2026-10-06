import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'carousel',
  type: 'registry:ui',
  categories: ['data-display'],
  framework: 'svelte',
  description:
    'Horizontal or vertical scroller with previous/next controls. Built on embla-carousel (the same engine as the React twin) and wired through Svelte context. Drop in images, cards, or any custom slide content.',
  files: [
    { path: 'Carousel.svelte', target: 'components/ui/carousel/Carousel.svelte' },
    { path: 'CarouselContent.svelte', target: 'components/ui/carousel/CarouselContent.svelte' },
    { path: 'CarouselFooter.svelte', target: 'components/ui/carousel/CarouselFooter.svelte' },
    { path: 'CarouselHeader.svelte', target: 'components/ui/carousel/CarouselHeader.svelte' },
    { path: 'CarouselIndicators.svelte', target: 'components/ui/carousel/CarouselIndicators.svelte' },
    { path: 'CarouselItem.svelte', target: 'components/ui/carousel/CarouselItem.svelte' },
    { path: 'CarouselNext.svelte', target: 'components/ui/carousel/CarouselNext.svelte' },
    { path: 'CarouselPrevious.svelte', target: 'components/ui/carousel/CarouselPrevious.svelte' },
    { path: 'carousel.variants.ts', target: 'components/ui/carousel/carousel.variants.ts' },
    { path: 'useCarousel.svelte.ts', target: 'components/ui/carousel/useCarousel.svelte.ts' },
    { path: 'index.ts', target: 'components/ui/carousel/index.ts' },
  ],
  dependencies: ['@lucide/svelte', 'class-variance-authority', 'embla-carousel'],
  registryDependencies: ['https://uipkge.dev/r/button.json'],
})

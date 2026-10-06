export { default as Carousel, type CarouselProps } from './Carousel.svelte'
export { default as CarouselContent, type CarouselContentProps } from './CarouselContent.svelte'
export { default as CarouselItem, type CarouselItemProps } from './CarouselItem.svelte'
export { default as CarouselPrevious, type CarouselPreviousProps } from './CarouselPrevious.svelte'
export { default as CarouselNext, type CarouselNextProps } from './CarouselNext.svelte'
export { default as CarouselIndicators, type CarouselIndicatorsProps } from './CarouselIndicators.svelte'
export { default as CarouselHeader, type CarouselHeaderProps } from './CarouselHeader.svelte'
export { default as CarouselFooter, type CarouselFooterProps } from './CarouselFooter.svelte'

// Re-export variant API from the sibling file (kept separate to avoid the
// Carousel.svelte <-> index.ts circular import that broke dev SSR in Vue).
export {
  carouselVariants,
  carouselItemVariants,
  type CarouselVariants,
  type CarouselItemVariants,
} from './carousel.variants'

export {
  useCarousel,
  getCarouselContext,
  CarouselState,
  CAROUSEL_CONTEXT_KEY,
  type CarouselApi,
  type CarouselOptions,
} from './useCarousel.svelte'

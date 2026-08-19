export { default as Carousel } from "./Carousel.vue";
export { default as CarouselContent } from "./CarouselContent.vue";
export { default as CarouselItem } from "./CarouselItem.vue";
export { default as CarouselPrevious } from "./CarouselPrevious.vue";
export { default as CarouselNext } from "./CarouselNext.vue";
export { default as CarouselIndicators } from "./CarouselIndicators.vue";
export { default as CarouselHeader } from "./CarouselHeader.vue";
export { default as CarouselFooter } from "./CarouselFooter.vue";

// Re-export variant API from the sibling file (kept separate to avoid the
// Carousel.vue <-> index.ts circular import that broke dev SSR).
export {
  carouselVariants,
  carouselItemVariants,
  type CarouselVariants,
  type CarouselItemVariants,
} from "./carousel.variants";

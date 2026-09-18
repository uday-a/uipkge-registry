import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'

/**
 * Variant definitions live in their own file (rather than the package
 * `index.ts` or inline in the SFC) so `Carousel.vue` / `CarouselItem.vue`
 * can import them without creating a circular dependency back through
 * the index. The circular form caused intermittent
 * `$setup.carouselVariants is not a function` errors during dev SSR.
 */
export const carouselVariants = cva('relative overflow-hidden', {
  variants: {
    orientation: {
      horizontal: 'w-full',
      vertical: 'h-full flex-col',
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
  },
})

export const carouselItemVariants = cva('flex shrink-0 grow-0 basis-full flex-col', {
  variants: {
    orientation: {
      horizontal: 'w-full',
      vertical: 'h-full',
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
  },
})

export type CarouselVariants = VariantProps<typeof carouselVariants>
export type CarouselItemVariants = VariantProps<typeof carouselItemVariants>

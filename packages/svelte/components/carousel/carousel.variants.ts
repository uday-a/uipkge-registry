import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'

/**
 * Variant definitions live in their own file (rather than the package
 * `index.ts` or inline in the component) so `Carousel.svelte` /
 * `CarouselItem.svelte` can import them without creating a circular
 * dependency back through the index.
 *
 * The class strings are 1:1 with the React twin's inlined orientation
 * classes (`relative overflow-hidden` + `w-full` / `h-full flex-col` on the
 * root; `flex shrink-0 grow-0 basis-full flex-col` + `w-full` / `h-full` on
 * the item). The `snap-*` utilities stay inlined in `CarouselContent.svelte`
 * / `CarouselItem.svelte`, exactly where React inlines them.
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

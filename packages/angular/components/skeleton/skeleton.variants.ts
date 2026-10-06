import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'

/**
 * Variant definitions live in their own file (rather than inline in the
 * SFC) so `SkeletonLoader.vue` can import them without the cva runtime
 * coupling that breaks SSR when several `<SkeletonLoader>` instances
 * render before the module graph fully resolves. Sibling pattern to
 * `card/card.variants.ts`.
 */
export const skeletonLoaderVariants = cva('bg-muted animate-pulse rounded', {
  variants: {
    variant: {
      text: 'h-4 w-full',
      chip: 'h-8 w-24 rounded-full',
      'chip-icon': 'h-8 w-8 rounded-full',
      article: '',
      avatar: 'size-12 rounded-full',
      'avatar-small': 'size-8 rounded-full',
      'avatar-large': 'size-16 rounded-full',
      heading: 'h-6 w-3/4',
      'heading-medium': 'h-5 w-1/2',
      'heading-small': 'h-4 w-1/3',
      image: 'aspect-video w-full rounded-lg',
      'image-small': 'h-32 w-32 rounded-lg',
      'image-large': 'h-64 w-full rounded-lg',
      card: '',
      'card-avatar': '',
      actions: '',
      table: 'h-4 w-full',
      'table-row': 'h-12 w-full',
      button: 'h-10 w-24 rounded-md',
      'button-icon': 'h-10 w-10 rounded-md',
      badge: 'h-6 w-16 rounded-full',
      tab: 'h-8 w-24 rounded-md',
      'date-picker': 'h-10 w-full',
      'list-item': 'h-16 w-full',
      'list-item-two-line': 'h-20 w-full',
      'list-item-three-line': 'h-24 w-full',
    },
  },
  defaultVariants: {
    variant: 'text',
  },
})

export type SkeletonLoaderVariants = VariantProps<typeof skeletonLoaderVariants>

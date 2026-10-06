import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'

/**
 * Variant definitions live in their own file (rather than the package
 * `index.ts`) so `Alert.vue` can `import { alertVariants } from
 * './alert.variants'` without creating a circular dependency through the
 * index. See card.variants.ts for the same pattern + the SSR symptom that
 * motivated the split.
 *
 * Layout: composition children (svg + AlertTitle + AlertDescription) are
 * direct descendants of the root so `[&>svg]` absolute positioning works.
 */
export const alertVariants = cva(
  'relative w-full rounded-lg border p-4 text-sm [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:size-4 [&>svg]:text-foreground [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px]',
  {
    variants: {
      variant: {
        default: 'bg-background text-foreground border-border',
        destructive: 'border-destructive/20 text-destructive bg-destructive/5 [&>svg]:text-destructive',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export type AlertVariants = VariantProps<typeof alertVariants>

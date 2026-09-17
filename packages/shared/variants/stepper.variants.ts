import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";

/**
 * Variant definitions live in their own file (rather than the package
 * `index.ts`) so `StepperIndicator.vue` / `StepperStep.vue` can import
 * them without creating a circular dependency back through the index.
 * Sibling pattern to `card/card.variants.ts`.
 */
export const stepperIndicatorVariants = cva(
  "flex items-center justify-center rounded-full font-semibold shrink-0",
  {
    variants: {
      status: {
        pending: "bg-muted text-muted-foreground",
        active: "bg-primary text-primary-foreground shadow-sm",
        completed: "bg-primary text-primary-foreground",
        error: "bg-destructive text-destructive-foreground",
      },
      size: {
        sm: "size-7 text-xs [&>svg]:size-3.5",
        default: "size-9 text-sm [&>svg]:size-4",
        lg: "size-11 text-base [&>svg]:size-5",
      },
    },
    defaultVariants: {
      status: "pending",
      size: "default",
    },
  },
);

export type StepperIndicatorVariants = VariantProps<
  typeof stepperIndicatorVariants
>;

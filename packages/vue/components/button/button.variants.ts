import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";

/**
 * Variant definitions live in their own file (rather than the package
 * `index.ts`) so `Button.vue` can `import { buttonVariants } from
 * './button.variants'` without creating a circular dependency through the
 * index. See card.variants.ts for the same pattern + the SSR symptom that
 * motivated the split.
 */
export const buttonVariants = cva(
  "inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[color,background-color,border-color,box-shadow,opacity,transform,scale] duration-150 active:scale-[0.97] active:duration-100 touch-manipulation disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        xs: "h-7 rounded-md gap-1 px-2 has-[>svg]:px-1.5 text-xs",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
        // Square counterpart of `xs` (h-7). Dense data toolbars run at 28px and
        // had no icon-only tier to match, so icon controls sat 4px taller than
        // the buttons beside them. Icons inside carry their own size class.
        "icon-xs": "size-7",
        // Row-action tier: the hover-revealed copy control inside a two-line
        // table cell. Anything taller than the 20px text line it sits on makes
        // the row grow when the control appears.
        "icon-2xs": "size-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export type ButtonVariants = VariantProps<typeof buttonVariants>;

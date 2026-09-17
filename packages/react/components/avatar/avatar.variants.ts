import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";

/**
 * Variant definitions live in their own file (rather than the package
 * `index.ts` or inline in the SFC) so `Avatar.vue` / `AvatarFallback.vue`
 * can `import { avatarVariants } from './avatar.variants'` without
 * creating a circular dependency back through the index. The circular
 * form caused intermittent `$setup.avatarVariants is not a function`
 * errors during dev SSR.
 */
export const avatarVariants = cva("relative flex shrink-0 overflow-hidden", {
  variants: {
    size: {
      xs: "size-4",
      sm: "size-6",
      default: "size-8",
      lg: "size-12",
      xl: "size-16",
      "2xl": "size-20",
    },
    rounded: {
      none: "rounded-none",
      sm: "rounded-sm",
      default: "rounded-full",
      md: "rounded-md",
      lg: "rounded-lg",
      xl: "rounded-xl",
      "2xl": "rounded-2xl",
      "3xl": "rounded-3xl",
      full: "rounded-full",
    },
    color: {
      default: "",
      primary: "bg-primary text-primary-foreground",
      secondary: "bg-secondary text-secondary-foreground",
      destructive: "bg-destructive text-destructive-foreground",
      success: "bg-success text-white dark:text-black",
      warning: "bg-warning text-black",
      info: "bg-info text-white dark:text-black",
      error: "bg-destructive text-white dark:text-black",
      muted: "bg-muted text-muted-foreground",
    },
    variant: {
      default: "",
      outlined: "border-2 border-current",
      soft: "bg-opacity-20",
    },
  },
  compoundVariants: [
    { color: "primary", variant: "soft", class: "bg-primary/20 text-primary" },
    {
      color: "secondary",
      variant: "soft",
      class: "bg-secondary/20 text-secondary-foreground",
    },
    {
      color: "destructive",
      variant: "soft",
      class: "bg-destructive/20 text-destructive",
    },
    { color: "success", variant: "soft", class: "bg-success/20 text-success" },
    { color: "warning", variant: "soft", class: "bg-warning/20 text-warning" },
    { color: "info", variant: "soft", class: "bg-info/20 text-info" },
    {
      color: "error",
      variant: "soft",
      class: "bg-destructive/20 text-destructive",
    },
  ],
  defaultVariants: {
    size: "default",
    rounded: "default",
    color: "default",
  },
});

export type AvatarVariants = VariantProps<typeof avatarVariants>;

export const avatarFallbackVariants = cva(
  "flex size-full items-center justify-center rounded-full bg-muted font-medium",
  {
    variants: {
      size: {
        xs: "text-xs",
        sm: "text-xs",
        default: "text-sm",
        lg: "text-base",
        xl: "text-lg",
        "2xl": "text-xl",
      },
      color: {
        default: "",
        primary: "bg-primary text-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground",
        destructive: "bg-destructive text-destructive-foreground",
        success: "bg-success text-white dark:text-black",
        warning: "bg-warning text-black",
        info: "bg-info text-white dark:text-black",
        error: "bg-destructive text-white dark:text-black",
        muted: "bg-muted text-muted-foreground",
      },
    },
    defaultVariants: {
      size: "default",
      color: "default",
    },
  },
);

export type AvatarFallbackVariants = VariantProps<
  typeof avatarFallbackVariants
>;

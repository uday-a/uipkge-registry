import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";

/**
 * Variant definitions live in their own file (rather than the package
 * `index.ts`) so consuming Vue SFCs can import without creating a circular
 * dependency through the index. See card.variants.ts for the canonical
 * example + the SSR symptom that motivated the split.
 */

export const timelineMediaVariants = cva(
  "relative z-10 flex shrink-0 items-center justify-center rounded-full ring-4 ring-background transition-colors [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        dot: "size-2.5",
        icon: "size-8 border border-border bg-card text-muted-foreground shadow-2xs [&>svg]:size-4",
        avatar:
          "size-8 ring-2 ring-border bg-muted overflow-hidden [&>img]:size-full [&>img]:object-cover [&>[data-slot=avatar]]:size-full",
        outline:
          "size-8 border border-border bg-background text-foreground [&>svg]:size-4",
      },
      status: {
        default: "",
        current: "",
        success: "",
        warning: "",
        error: "",
        info: "",
        muted: "",
      },
    },
    compoundVariants: [
      // DOT
      {
        variant: "dot",
        status: "default",
        class: "bg-primary text-primary-foreground",
      },
      {
        variant: "dot",
        status: "current",
        class: "bg-primary text-primary-foreground ring-4 ring-primary/25",
      },
      {
        variant: "dot",
        status: "success",
        class: "bg-success text-success-foreground",
      },
      {
        variant: "dot",
        status: "warning",
        class: "bg-warning text-warning-foreground",
      },
      {
        variant: "dot",
        status: "error",
        class: "bg-destructive text-destructive-foreground",
      },
      {
        variant: "dot",
        status: "info",
        class: "bg-info text-info-foreground",
      },
      {
        variant: "dot",
        status: "muted",
        class: "bg-muted-foreground/30 text-muted-foreground",
      },

      // ICON
      {
        variant: "icon",
        status: "default",
        class: "border-border bg-card text-muted-foreground",
      },
      {
        variant: "icon",
        status: "current",
        class:
          "border-primary/50 bg-primary/10 text-primary ring-4 ring-primary/15",
      },
      {
        variant: "icon",
        status: "success",
        class:
          "border-success/40 bg-success/10 text-success ring-4 ring-success/10",
      },
      {
        variant: "icon",
        status: "warning",
        class:
          "border-warning/40 bg-warning/10 text-warning ring-4 ring-warning/10",
      },
      {
        variant: "icon",
        status: "error",
        class:
          "border-destructive/40 bg-destructive/10 text-destructive ring-4 ring-destructive/10",
      },
      {
        variant: "icon",
        status: "info",
        class: "border-info/40 bg-info/10 text-info ring-4 ring-info/10",
      },
      {
        variant: "icon",
        status: "muted",
        class: "border-border/60 bg-muted/40 text-muted-foreground/60",
      },

      // OUTLINE
      {
        variant: "outline",
        status: "default",
        class: "border-border text-foreground bg-background",
      },
      {
        variant: "outline",
        status: "current",
        class:
          "border-primary text-primary bg-background ring-4 ring-primary/25",
      },
      {
        variant: "outline",
        status: "success",
        class: "border-success text-success bg-background",
      },
      {
        variant: "outline",
        status: "warning",
        class: "border-warning text-warning bg-background",
      },
      {
        variant: "outline",
        status: "error",
        class: "border-destructive text-destructive bg-background",
      },
      {
        variant: "outline",
        status: "info",
        class: "border-info text-info bg-background",
      },
      {
        variant: "outline",
        status: "muted",
        class: "border-border text-muted-foreground bg-background",
      },
    ],
    defaultVariants: {
      variant: "dot",
      status: "default",
    },
  },
);

export type TimelineMediaVariantsProps = VariantProps<
  typeof timelineMediaVariants
>;
export type TimelineMediaVariant = "dot" | "icon" | "avatar" | "outline";

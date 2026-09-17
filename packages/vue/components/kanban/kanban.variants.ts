import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";

export const kanbanColumnVariants = cva(
  "flex min-h-[300px] w-72 shrink-0 flex-col gap-2 rounded-xl border bg-muted/40 p-3 transition-colors duration-200 ease-out",
  {
    variants: {
      isOver: {
        true: "border-primary/50 bg-primary/5 ring-2 ring-primary/20",
        false: "border-border/70",
      },
    },
    defaultVariants: {
      isOver: false,
    },
  },
);

export const kanbanCardVariants = cva(
  "group relative flex cursor-grab flex-col gap-2 rounded-lg border bg-card p-3 text-card-foreground shadow-xs transition-[border-color,box-shadow,opacity] duration-150 ease-out active:cursor-grabbing hover:border-border hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
  {
    variants: {
      isDragging: {
        // Keyboard grab reuses this state, so the held card stays fully
        // opaque — unlike a pointer drag there is no drag image to look at.
        true: "shadow-none ring-2 ring-primary/40 opacity-100 data-[state=dragging]:opacity-40",
        false: "opacity-100",
      },
    },
    defaultVariants: {
      isDragging: false,
    },
  },
);

export type KanbanColumnVariantsProps = VariantProps<
  typeof kanbanColumnVariants
>;
export type KanbanCardVariantsProps = VariantProps<typeof kanbanCardVariants>;

import { cva } from "class-variance-authority";

export const treeSelectTriggerVariants = cva(
  "flex w-full items-center justify-between gap-2 rounded-md border border-input bg-transparent text-sm shadow-xs transition-[color,box-shadow] outline-none hover:border-ring/50 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      size: {
        sm: "h-8 text-xs px-2.5",
        default: "h-9 text-sm px-3",
        lg: "h-11 text-base px-4",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

export type TreeSelectVariants = ReturnType<typeof treeSelectTriggerVariants>;

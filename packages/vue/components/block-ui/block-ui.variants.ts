import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";

export const blockUiVariants = cva("relative inline-block");

export type BlockUiVariants = VariantProps<typeof blockUiVariants>;

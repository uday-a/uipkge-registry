import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";

/**
 * Preset gradients keyed by name. Each value is a full CSS gradient string
 * applied as `background-image` with `background-clip: text`.
 */
export const gradientTextPresets = {
  sunset: "linear-gradient(to right, #ff7e5f, #feb47b)",
  ocean: "linear-gradient(to right, #2193b0, #6dd5ed)",
  forest: "linear-gradient(to right, #11998e, #38ef7d)",
  fire: "linear-gradient(to right, #f12711, #f5af19)",
  candy: "linear-gradient(to right, #f857a6, #ff8a5c)",
  aurora: "linear-gradient(to right, #00c6ff, #0072ff, #00c6ff)",
  rainbow:
    "linear-gradient(to right, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3)",
  gold: "linear-gradient(to right, #bf953f, #fcf6ba, #b38728, #fbf5b7, #aa771c)",
  neon: "linear-gradient(to right, #00f260, #0575e6)",
  grape: "linear-gradient(to right, #6a11cb, #2575fc)",
} as const;

export type GradientPreset = keyof typeof gradientTextPresets;

export const gradientTextVariants = cva("inline-block", {
  variants: {},
  defaultVariants: {},
});

export type GradientTextVariants = VariantProps<typeof gradientTextVariants>;

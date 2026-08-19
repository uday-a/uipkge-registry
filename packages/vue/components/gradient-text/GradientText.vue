<script setup lang="ts">
import { computed } from "vue";
import type { HTMLAttributes } from "vue";
import { Primitive } from "reka-ui";
import { cn } from "@/lib/utils";
import {
  gradientTextPresets,
  type GradientPreset,
} from "./gradient-text.variants";

type Direction =
  | "to right"
  | "to left"
  | "to top"
  | "to bottom"
  | "to top right"
  | "to top left"
  | "to bottom right"
  | "to bottom left";

const props = withDefaults(
  defineProps<{
    /** Rendered element / component via Primitive. */
    as?: string;
    asChild?: boolean;
    /** Preset gradient name. Overrides from/to when set. */
    preset?: GradientPreset;
    /** Start color of a custom two-stop gradient. */
    from?: string;
    /** End color of a custom two-stop gradient. */
    to?: string;
    /** Gradient direction. */
    direction?: Direction;
    /** Fully custom CSS gradient (e.g. 'linear-gradient(45deg, #f00, #00f, #0f0)'). Overrides preset/from/to. */
    gradient?: string;
    /** Animate the gradient (subtle background-position shift). */
    animated?: boolean;
    /** Animation duration in seconds. Default 4. */
    animationDuration?: number;
    class?: HTMLAttributes["class"];
  }>(),
  {
    as: "span",
    direction: "to right",
    animated: false,
    animationDuration: 4,
  },
);

const gradientValue = computed(() => {
  if (props.gradient) return props.gradient;
  if (props.preset) return gradientTextPresets[props.preset] ?? "";
  if (props.from && props.to) {
    return `linear-gradient(${props.direction}, ${props.from}, ${props.to})`;
  }
  // Default fallback: primary token gradient.
  return "linear-gradient(to right, var(--primary), var(--primary))";
});

const style = computed(() => ({
  backgroundImage: gradientValue.value,
  backgroundClip: "text",
  WebkitBackgroundClip: "text",
  color: "transparent",
  WebkitTextFillColor: "transparent",
  backgroundSize: props.animated ? "200% 200%" : undefined,
}));
</script>

<template>
  <Primitive
    data-uipkge
    data-slot="gradient-text"
    :data-preset="preset"
    :data-animated="animated ? 'true' : undefined"
    :as="as"
    :as-child="asChild"
    :class="
      cn(
        'inline-block',
        animated
          ? `motion-safe:animate-[gradient-text-shift_${props.animationDuration}s_ease_infinite]`
          : '',
        props.class,
      )
    "
    :style="style"
  >
    <slot />
  </Primitive>
</template>

<!-- Unscoped: Tailwind arbitrary `animate-[gradient-text-shift_…]` looks up
     this name globally. Vue would hash keyframes under `scoped`, breaking the
     animation class on the Primitive. -->
<style>
@media (prefers-reduced-motion: no-preference) {
  @keyframes gradient-text-shift {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
}
</style>

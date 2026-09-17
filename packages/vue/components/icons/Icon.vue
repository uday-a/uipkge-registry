<script setup lang="ts">
import { computed } from "vue";
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

/**
 * Universal Icon component supporting multiple icon libraries:
 * - Lucide (default, via slot)
 * - Font Awesome (via class:fa-* and :class)
 * - Material Design Icons (via class:mdi-* and :class)
 * - Heroicons (via slot)
 * - Custom SVG (via src prop)
 */
const props = withDefaults(
  defineProps<{
    // Size
    size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "inherit";
    // Color
    color?: string;
    // Custom class for icon libraries (fa-, mdi-, etc.)
    class?: HTMLAttributes["class"];
    // For img-based icons
    src?: string;
    alt?: string;
    // Rotation/flip
    rotation?: number | string;
    flip?: "horizontal" | "vertical" | "both";
    // A11y
    label?: string;
    ariaLabel?: string;
    // Style
    inline?: boolean;
  }>(),
  {
    size: "md",
    inline: true,
  },
);

const sizeClasses = {
  xs: "size-3",
  sm: "size-4",
  md: "size-5",
  lg: "size-6",
  xl: "size-8",
  "2xl": "size-12",
  inherit: "size-full",
};

const rotationDeg = computed(() => {
  if (!props.rotation) return undefined;
  return typeof props.rotation === "string"
    ? parseInt(props.rotation)
    : props.rotation;
});

const flipClasses = computed(() => {
  if (!props.flip) return "";
  if (props.flip === "horizontal") return "-scale-x-100";
  if (props.flip === "vertical") return "-scale-y-100";
  if (props.flip === "both") return "-scale-x-100 -scale-y-100";
  return "";
});
</script>

<template>
  <!-- Image-based icon (Material Design, custom URLs, etc.) -->
  <img
    v-if="src"
    data-uipkge
    data-slot="icon"
    :src="src"
    :alt="alt || label || ''"
    :class="
      cn(
        'shrink-0 object-contain',
        inline ? 'inline-block' : 'block',
        size !== 'inherit' ? sizeClasses[size] : '',
        flipClasses,
        props.class,
      )
    "
    :style="{
      color: color,
      transform: rotationDeg ? `rotate(${rotationDeg}deg)` : undefined,
    }"
    :aria-label="ariaLabel || label || undefined"
    role="img"
  />

  <!-- Slot-based icon (Lucide, Heroicons, inline SVG) -->
  <span
    v-else
    data-uipkge
    data-slot="icon"
    :class="
      cn(
        'shrink-0 items-center justify-center',
        inline ? 'inline-flex' : 'flex',
        size !== 'inherit' ? sizeClasses[size] : '',
        flipClasses,
        props.class,
      )
    "
    :style="{
      color: color,
      transform: rotationDeg ? `rotate(${rotationDeg}deg)` : undefined,
    }"
    :aria-label="ariaLabel || label || undefined"
    :role="ariaLabel || label ? 'img' : undefined"
    :aria-hidden="!(ariaLabel || label) ? 'true' : undefined"
  >
    <slot />
  </span>
</template>

<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { Primitive } from "reka-ui";
import { cn } from "@/lib/utils";
import { fabVariants } from "./fab.variants";

type Variant = "default" | "secondary" | "destructive" | "outline";
type Size = "mini" | "default" | "large" | "extended";
type Position =
  | "bottom-right"
  | "bottom-left"
  | "top-right"
  | "top-left"
  | "bottom-center"
  | "inline";

interface Props {
  /** Label text — renders an extended FAB. Use the default slot for an icon. */
  label?: string;
  as?: string;
  asChild?: boolean;
  variant?: Variant;
  size?: Size;
  position?: Position;
  /** Use absolute instead of fixed positioning (for contained FABs). */
  absolute?: boolean;
  disabled?: boolean;
  /** Accessible label. Defaults to the label prop or 'Floating action'. */
  ariaLabel?: string;
  class?: HTMLAttributes["class"];
}

const props = withDefaults(defineProps<Props>(), {
  as: "button",
  variant: "default",
  size: "default",
  position: "bottom-right",
  absolute: false,
});

const emit = defineEmits<{ (e: "click", event: MouseEvent): void }>();

function onClick(e: MouseEvent) {
  if (props.disabled) return;
  emit("click", e);
}

const resolvedSize = () => (props.label ? "extended" : props.size);
</script>

<template>
  <Primitive
    data-uipkge
    data-slot="fab"
    :data-variant="variant"
    :data-size="resolvedSize()"
    :data-position="position"
    :as="as"
    :as-child="asChild"
    :disabled="disabled"
    :aria-label="ariaLabel || label || 'Floating action'"
    :class="
      cn(
        fabVariants({ variant, size: resolvedSize(), position }),
        absolute && position !== 'inline' && 'absolute',
        props.class,
      )
    "
    @click="onClick"
  >
    <slot />
    <span v-if="label" class="pr-1">{{ label }}</span>
  </Primitive>
</template>

<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

const props = withDefaults(
  defineProps<{
    align?: "left" | "center" | "right";
    gap?: "sm" | "md" | "lg";
    class?: HTMLAttributes["class"];
  }>(),
  {
    align: "right",
    gap: "md",
  },
);

const alignClasses = {
  left: "justify-start",
  center: "justify-center",
  right: "justify-end",
};

const gapClasses = {
  sm: "gap-2",
  md: "gap-3",
  lg: "gap-4",
};
</script>

<template>
  <div
    data-uipkge
    data-slot="form-actions"
    :class="
      cn(
        'flex flex-wrap items-center',
        alignClasses[align],
        gapClasses[gap],
        props.class,
      )
    "
  >
    <slot />
  </div>
</template>

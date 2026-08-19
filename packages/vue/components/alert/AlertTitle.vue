<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

const props = defineProps<{
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "div";
  class?: HTMLAttributes["class"];
}>();
</script>

<template>
  <component
    :is="props.as ?? 'h5'"
    data-uipkge
    data-slot="alert-title"
    :class="
      cn('mb-1 text-sm leading-none font-medium tracking-tight', props.class)
    "
  >
    <slot />
  </component>
</template>

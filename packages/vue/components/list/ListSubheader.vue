<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

const props = defineProps<{
  class?: HTMLAttributes["class"];
  inset?: boolean;
}>();
</script>

<template>
  <li
    data-uipkge
    data-slot="list-subheader"
    :class="
      cn(
        'text-muted-foreground px-2 py-1.5 text-xs font-semibold tracking-wide uppercase',
        inset && 'pl-8',
        props.class,
      )
    "
    v-bind="$attrs"
  >
    <slot />
  </li>
</template>

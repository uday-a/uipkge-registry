<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

const props = withDefaults(
  defineProps<{
    columns?: 2 | 3 | 4;
    class?: HTMLAttributes["class"];
  }>(),
  { columns: 4 },
);
</script>

<template>
  <div
    data-uipkge
    data-slot="kpi-grid"
    :class="
      cn(
        'grid gap-4 md:grid-cols-2',
        columns === 3
          ? 'lg:grid-cols-3'
          : columns === 2
            ? 'lg:grid-cols-2'
            : 'lg:grid-cols-4',
        props.class,
      )
    "
  >
    <slot />
  </div>
</template>

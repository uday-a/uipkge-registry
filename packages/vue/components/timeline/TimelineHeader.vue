<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();
</script>

<template>
  <div
    data-uipkge
    data-slot="timeline-header"
    :class="
      cn('flex flex-wrap items-center justify-between gap-2', props.class)
    "
  >
    <slot />
  </div>
</template>

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
    data-slot="card-header"
    :class="
      cn(
        'grid auto-rows-min grid-cols-[minmax(0,1fr)] grid-rows-[auto_auto] items-start gap-1.5 p-6 has-data-[slot=card-action]:grid-cols-[minmax(0,1fr)_auto]',
        props.class,
      )
    "
  >
    <slot />
  </div>
</template>

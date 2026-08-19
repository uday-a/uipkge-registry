<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

interface Props {
  class?: HTMLAttributes["class"];
}

const props = defineProps<Props>();
</script>

<template>
  <div
    data-slot="kanban-column-header"
    :class="
      cn('flex items-center justify-between gap-2 px-1 py-0.5', props.class)
    "
  >
    <slot />
  </div>
</template>

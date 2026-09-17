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
    data-slot="kanban-board"
    :class="
      cn('flex w-full items-start gap-4 overflow-x-auto pb-4', props.class)
    "
  >
    <slot />
  </div>
</template>

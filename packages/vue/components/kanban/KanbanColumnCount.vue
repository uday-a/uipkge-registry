<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

interface Props {
  count?: number | string;
  class?: HTMLAttributes["class"];
}

const props = defineProps<Props>();
</script>

<template>
  <span
    data-slot="kanban-column-count"
    :class="
      cn(
        'bg-muted text-muted-foreground rounded-md px-1.5 py-0.5 text-xs font-medium tabular-nums',
        props.class,
      )
    "
  >
    <slot>{{ count }}</slot>
  </span>
</template>

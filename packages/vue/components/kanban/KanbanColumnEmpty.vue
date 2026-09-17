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
    data-slot="kanban-column-empty"
    :class="
      cn(
        'border-border/60 text-muted-foreground/60 flex flex-1 items-center justify-center rounded-lg border border-dashed py-8 text-xs',
        props.class,
      )
    "
  >
    <slot>No cards</slot>
  </div>
</template>

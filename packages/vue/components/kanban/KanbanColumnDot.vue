<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

interface Props {
  color?: string;
  class?: HTMLAttributes["class"];
}

const props = withDefaults(defineProps<Props>(), {
  color: "bg-primary",
});
</script>

<template>
  <span
    data-slot="kanban-column-dot"
    :class="cn('size-2 shrink-0 rounded-full', props.color, props.class)"
  />
</template>

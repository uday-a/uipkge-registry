<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-vue-next";

interface Props {
  class?: HTMLAttributes["class"];
}

const props = defineProps<Props>();
</script>

<template>
  <button
    type="button"
    data-slot="kanban-column-add"
    :class="
      cn(
        'text-muted-foreground hover:bg-background hover:text-foreground focus-visible:ring-ring inline-flex size-6 items-center justify-center rounded-md transition-colors focus-visible:ring-1 focus-visible:outline-none',
        props.class,
      )
    "
  >
    <slot>
      <Plus class="size-3.5" />
    </slot>
  </button>
</template>

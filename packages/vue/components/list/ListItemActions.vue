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
    data-uipkge
    data-slot="list-item-actions"
    :class="
      cn(
        'text-muted-foreground flex shrink-0 items-center gap-1.5 self-center',
        props.class,
      )
    "
  >
    <slot />
  </div>
</template>

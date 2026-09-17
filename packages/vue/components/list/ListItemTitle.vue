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
    data-slot="list-item-title"
    :class="
      cn(
        'text-foreground truncate text-sm leading-none font-medium',
        props.class,
      )
    "
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

interface Props {
  class?: HTMLAttributes["class"];
  align?: "inline" | "block";
}

const props = withDefaults(defineProps<Props>(), {
  align: "inline",
});
</script>

<template>
  <div
    data-uipkge
    data-slot="input-group-addon"
    :class="
      cn(
        'text-muted-foreground flex shrink-0 items-center justify-center px-3 text-sm select-none',
        'border-input first:rounded-l-[calc(var(--radius)-1px)] last:rounded-r-[calc(var(--radius)-1px)]',
        'border-r first:border-l-0 last:border-r-0',
        props.class,
      )
    "
  >
    <slot />
  </div>
</template>

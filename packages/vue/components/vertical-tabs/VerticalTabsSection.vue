<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

const props = defineProps<{
  label: string;
  class?: HTMLAttributes["class"];
}>();
</script>

<template>
  <div
    data-uipkge
    data-slot="vertical-tabs-section"
    :class="
      cn(
        'text-muted-foreground mt-3 mb-1 px-2 text-xs font-medium tracking-wider uppercase first:mt-0',
        props.class,
      )
    "
  >
    {{ label }}
  </div>
</template>

<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();
</script>

<template>
  <div
    data-uipkge
    data-slot="alert-description"
    :class="
      cn(
        'text-muted-foreground text-sm leading-relaxed [&_p]:leading-relaxed',
        props.class,
      )
    "
  >
    <slot />
  </div>
</template>

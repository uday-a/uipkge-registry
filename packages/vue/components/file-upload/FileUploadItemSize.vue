<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();
</script>

<template>
  <span
    :class="cn('text-muted-foreground text-xs', props.class)"
    v-bind="$attrs"
  >
    <slot />
  </span>
</template>

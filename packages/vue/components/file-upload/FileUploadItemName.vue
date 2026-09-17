<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();
</script>

<template>
  <p :class="cn('truncate text-sm font-medium', props.class)" v-bind="$attrs">
    <slot />
  </p>
</template>

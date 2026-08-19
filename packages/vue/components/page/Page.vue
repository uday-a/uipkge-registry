<script setup lang="ts">
import { cn } from "@/lib/utils";

defineProps<{
  class?: string;
}>();
</script>

<template>
  <div data-uipkge data-slot="page" :class="cn('space-y-6', $props.class)">
    <slot />
  </div>
</template>

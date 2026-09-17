<script setup lang="ts">
import { cn } from "@/lib/utils";

defineProps<{
  class?: string;
}>();
</script>

<template>
  <div
    data-uipkge
    data-slot="page-header"
    :class="
      cn(
        'flex flex-col justify-between gap-4 sm:flex-row sm:items-center',
        $props.class,
      )
    "
  >
    <div class="flex-1">
      <slot />
    </div>
    <slot name="actions" />
  </div>
</template>

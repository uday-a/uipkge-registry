<script setup lang="ts">
import { cn } from "@/lib/utils";

defineProps<{
  title: string;
  description?: string;
  class?: string;
}>();
</script>

<template>
  <div
    data-uipkge
    data-slot="page-header-heading"
    :class="cn('', $props.class)"
  >
    <h2 class="text-xl font-bold tracking-tight">{{ title }}</h2>
    <p
      v-if="description"
      class="text-muted-foreground mt-1 text-sm leading-relaxed"
    >
      {{ description }}
    </p>
  </div>
</template>

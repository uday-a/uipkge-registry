<script setup lang="ts">
import { cn } from '@/lib/utils'

defineProps<{
  class?: string
}>()
</script>

<template>
  <div data-uipkge data-slot="page-body" :class="cn('', $props.class)">
    <slot />
  </div>
</template>

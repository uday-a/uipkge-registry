<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <div data-uipkge data-slot="board-lane-header" :class="cn('flex items-center justify-between gap-2', props.class)">
    <slot />
  </div>
</template>

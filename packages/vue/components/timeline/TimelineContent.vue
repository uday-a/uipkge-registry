<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <div data-uipkge data-slot="timeline-content" :class="cn('flex-1 space-y-1', props.class)" v-bind="$attrs">
    <slot />
  </div>
</template>

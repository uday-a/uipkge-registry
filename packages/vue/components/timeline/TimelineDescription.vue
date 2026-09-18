<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <p
    data-uipkge
    data-slot="timeline-description"
    :class="cn('text-muted-foreground text-sm', props.class)"
    v-bind="$attrs"
  >
    <slot />
  </p>
</template>

<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

interface Props {
  class?: HTMLAttributes['class']
  tag?: string
}

const props = withDefaults(defineProps<Props>(), {
  tag: 'div',
})
</script>

<template>
  <component :is="props.tag" data-uipkge data-slot="skeleton-group" :class="cn('space-y-2', props.class)">
    <slot />
  </component>
</template>

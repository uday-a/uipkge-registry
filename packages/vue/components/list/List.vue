<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
  as?: 'ul' | 'ol' | 'div'
}>()
</script>

<template>
  <component
    :is="props.as ?? 'ul'"
    data-uipkge
    data-slot="list"
    :class="cn('list-none space-y-1', props.class)"
    v-bind="$attrs"
  >
    <slot />
  </component>
</template>

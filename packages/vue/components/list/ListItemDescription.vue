<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

interface Props {
  class?: HTMLAttributes['class']
}

const props = defineProps<Props>()
</script>

<template>
  <div
    data-uipkge
    data-slot="list-item-description"
    :class="cn('text-muted-foreground line-clamp-1 text-xs', props.class)"
  >
    <slot />
  </div>
</template>

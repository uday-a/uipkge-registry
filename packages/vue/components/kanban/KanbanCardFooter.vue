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
    data-slot="kanban-card-footer"
    :class="cn('text-muted-foreground mt-1 flex items-center justify-between gap-2 pt-1 text-xs', props.class)"
  >
    <slot />
  </div>
</template>

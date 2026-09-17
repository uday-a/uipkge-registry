<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

interface Props {
  class?: HTMLAttributes['class']
}

const props = defineProps<Props>()
</script>

<template>
  <p data-slot="kanban-card-description" :class="cn('text-muted-foreground line-clamp-2 text-xs', props.class)">
    <slot />
  </p>
</template>

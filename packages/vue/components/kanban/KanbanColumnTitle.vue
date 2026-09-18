<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

interface Props {
  class?: HTMLAttributes['class']
}

const props = defineProps<Props>()
</script>

<template>
  <h3 data-slot="kanban-column-title" :class="cn('text-foreground text-sm font-semibold tracking-tight', props.class)">
    <slot />
  </h3>
</template>

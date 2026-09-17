<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

interface Props {
  class?: HTMLAttributes['class']
}

const props = defineProps<Props>()
</script>

<template>
  <p data-slot="kanban-card-title" :class="cn('text-foreground text-sm leading-snug font-medium', props.class)">
    <slot />
  </p>
</template>

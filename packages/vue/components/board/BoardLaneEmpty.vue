<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
  /** Show only when this is true (consumer wires from `lane.length === 0`). */
  when?: boolean
}>()
</script>

<template>
  <div
    v-if="when !== false"
    data-uipkge
    data-slot="board-lane-empty"
    :class="
      cn(
        'text-muted-foreground/70 border-border/60 rounded-lg border border-dashed py-6 text-center text-xs',
        props.class,
      )
    "
  >
    <slot />
  </div>
</template>

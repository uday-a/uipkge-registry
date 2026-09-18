<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{
  label: string
  value?: string
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <div
    data-uipkge
    data-slot="labeled-value"
    :class="cn('flex items-center justify-between gap-3 text-sm', props.class)"
  >
    <span data-slot="labeled-value-label" class="text-muted-foreground shrink-0">{{ label }}</span>
    <slot>
      <span data-slot="labeled-value-value" class="min-w-0 text-right font-medium">{{ value }}</span>
    </slot>
  </div>
</template>

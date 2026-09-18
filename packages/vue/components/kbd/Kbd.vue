<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <kbd
    data-uipkge
    data-slot="kbd"
    :class="
      cn(
        'bg-muted text-muted-foreground pointer-events-none inline-flex h-5 min-w-5 items-center justify-center gap-1 rounded border px-1.5 font-mono text-xs font-medium select-none',
        props.class,
      )
    "
  >
    <slot />
  </kbd>
</template>

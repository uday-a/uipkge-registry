<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

interface Props {
  class?: HTMLAttributes['class']
  variant?: 'default' | 'secondary' | 'ghost' | 'outline'
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'ghost',
})

const variantClasses: Record<string, string> = {
  default: 'bg-primary text-primary-foreground hover:bg-primary/90',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
  ghost: 'hover:bg-accent hover:text-accent-foreground',
  outline: 'border-l border-input hover:bg-accent hover:text-accent-foreground',
}
</script>

<template>
  <button
    type="button"
    data-uipkge
    data-slot="input-group-button"
    :disabled="disabled"
    :class="
      cn(
        'inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5 px-3 text-sm font-medium transition-colors select-none',
        'first:rounded-l-[calc(var(--radius)-1px)] last:rounded-r-[calc(var(--radius)-1px)]',
        'focus-visible:ring-ring focus-visible:ring-1 focus-visible:outline-none',
        'disabled:pointer-events-none disabled:opacity-50',
        variantClasses[variant],
        props.class,
      )
    "
  >
    <slot />
  </button>
</template>

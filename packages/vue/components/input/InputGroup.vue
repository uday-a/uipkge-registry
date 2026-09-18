<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

interface Props {
  class?: HTMLAttributes['class']
  size?: 'small' | 'middle' | 'large'
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'middle',
})

const sizeClasses: Record<string, string> = {
  small: 'h-8 text-xs',
  middle: 'h-9 text-sm',
  large: 'h-11 text-base',
}
</script>

<template>
  <div
    data-uipkge
    data-slot="input-group"
    :data-size="size"
    :data-disabled="disabled ? '' : undefined"
    :class="
      cn(
        'group/input-group border-input bg-background relative flex w-full items-stretch rounded-md border shadow-xs transition-[color,box-shadow]',
        'focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px] focus-within:outline-none',
        '[&_[data-slot=input]]:rounded-none [&_[data-slot=input]]:border-0 [&_[data-slot=input]]:bg-transparent [&_[data-slot=input]]:shadow-none [&_[data-slot=input]]:focus-within:ring-0',
        '[&_input]:h-full [&_input]:flex-1 [&_input]:border-0 [&_input]:bg-transparent [&_input]:px-3 [&_input]:text-sm [&_input]:outline-none [&_input]:focus-visible:ring-0',
        disabled && 'bg-muted/30 pointer-events-none cursor-not-allowed opacity-50',
        sizeClasses[size],
        props.class,
      )
    "
  >
    <slot />
  </div>
</template>

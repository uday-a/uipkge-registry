<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed, useAttrs } from 'vue'
import { cn } from '@/lib/utils'

defineOptions({ inheritAttrs: false })

const props = defineProps<{
  class?: HTMLAttributes['class']
  as?: 'li' | 'div' | 'a'
  active?: boolean
  disabled?: boolean
}>()

const attrs = useAttrs()

// Only show pointer/hover affordances when the item is actually interactive.
const isInteractive = computed(() => {
  if (props.disabled) return false
  if ((props.as ?? 'li') === 'a') return true
  if (attrs.href != null && attrs.href !== false) return true
  if (typeof attrs.onClick === 'function') return true
  return false
})
</script>

<template>
  <component
    :is="props.as ?? 'li'"
    data-uipkge
    data-slot="list-item"
    :data-active="active ? '' : undefined"
    :data-disabled="disabled ? '' : undefined"
    :aria-disabled="disabled ? 'true' : undefined"
    :aria-current="active ? 'true' : undefined"
    :tabindex="disabled ? -1 : undefined"
    :class="
      cn(
        'rounded-md px-2 py-1.5 text-sm transition-colors duration-200 select-none focus-visible:outline-none',
        'has-[>[data-slot=list-item-content]]:flex has-[>[data-slot=list-item-content]]:items-center has-[>[data-slot=list-item-content]]:gap-3',
        !disabled && isInteractive && 'hover:bg-accent focus-visible:bg-accent cursor-pointer',
        active && 'bg-accent text-accent-foreground',
        disabled && 'pointer-events-none cursor-not-allowed opacity-50',
        props.class,
      )
    "
    v-bind="$attrs"
  >
    <slot />
  </component>
</template>

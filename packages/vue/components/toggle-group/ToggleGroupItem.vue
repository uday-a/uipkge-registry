<script setup lang="ts">
import type { HTMLAttributes, Ref } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { ToggleGroupItem, useForwardProps } from 'reka-ui'
import { computed, inject } from 'vue'
import { cn } from '@/lib/utils'
import { toggleVariants } from '@/components/ui/toggle'

type ToggleGroupContext = {
  variant?: Ref<'default' | 'outline' | undefined> | 'default' | 'outline'
  size?: Ref<'default' | 'sm' | 'lg' | undefined> | 'default' | 'sm' | 'lg'
  spacing?: Ref<number | undefined> | number
}

// Inlined unions: SFC compiler can't extract runtime props from
// indexed-access types. Same for reka-ui's ToggleGroupItemProps.
const props = defineProps<{
  class?: HTMLAttributes['class']
  variant?: 'default' | 'outline'
  size?: 'default' | 'sm' | 'lg'
  asChild?: boolean
  as?: string | object
  value: string
  disabled?: boolean
}>()

const context = inject<ToggleGroupContext>('toggleGroup')

function unwrap<T>(v: Ref<T> | T | undefined): T | undefined {
  if (v && typeof v === 'object' && 'value' in (v as object)) return (v as Ref<T>).value
  return v as T | undefined
}

const effectiveVariant = computed(() => unwrap(context?.variant) || props.variant)
const effectiveSize = computed(() => unwrap(context?.size) || props.size)
const effectiveSpacing = computed(() => unwrap(context?.spacing))

const delegatedProps = reactiveOmit(props, 'class', 'size', 'variant')
const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
  <ToggleGroupItem
    v-slot="slotProps"
    data-uipkge
    data-slot="toggle-group-item"
    :data-variant="effectiveVariant"
    :data-size="effectiveSize"
    :data-spacing="effectiveSpacing"
    v-bind="forwardedProps"
    :class="
      cn(
        toggleVariants({
          variant: effectiveVariant,
          size: effectiveSize,
        }),
        // z-10 keeps label/icons above the sliding indicator. When the parent
        // has data-animated=true (single-select), on-state surface lives on the
        // indicator — suppress item bg so the pill can slide cleanly.
        'relative z-10 w-auto min-w-0 shrink-0 px-3 focus:z-10 focus-visible:z-10',
        'group-data-[animated=true]/toggle-group:data-[state=on]:bg-transparent group-data-[animated=true]/toggle-group:data-[state=on]:hover:bg-transparent',
        // first/last-of-type (not first/last-child): sliding indicator is a sibling span
        // and must not steal end-cap rounding or the outline left border.
        'data-[spacing=0]:rounded-none data-[spacing=0]:shadow-none data-[spacing=0]:first-of-type:rounded-l-md data-[spacing=0]:last-of-type:rounded-r-md data-[spacing=0]:data-[variant=outline]:border-l-0 data-[spacing=0]:data-[variant=outline]:first-of-type:border-l',
        props.class,
      )
    "
  >
    <slot v-bind="slotProps" />
  </ToggleGroupItem>
</template>

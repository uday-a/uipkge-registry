<script setup lang="ts">
import type { PopoverContentEmits, PopoverContentProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { PopoverContent, PopoverPortal, useForwardPropsEmits } from 'reka-ui'
import { inject } from 'vue'
import { cn } from '@/lib/utils'
import { POPOVER_INJECTION_KEY } from './context'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<PopoverContentProps & { class?: HTMLAttributes['class'] }>(), {
  align: 'center',
  sideOffset: 4,
})
const emits = defineEmits<PopoverContentEmits>()

const ctx = inject(POPOVER_INJECTION_KEY, null)

const delegatedProps = reactiveOmit(props, 'class')

const forwarded = useForwardPropsEmits(delegatedProps, emits)

// Compose so closeBehavior still applies when consumers pass their own handlers.
// Spread after `forwarded` so we replace (not merge-double) the emit wrappers.
function onPointerDownOutside(e: Event) {
  const mode = ctx?.closeBehavior.value ?? 'auto'
  if (mode === 'esc' || mode === 'manual' || mode === 'none') {
    e.preventDefault()
  }
  emits('pointerDownOutside', e as never)
}

function onEscapeKeyDown(e: KeyboardEvent) {
  const mode = ctx?.closeBehavior.value ?? 'auto'
  if (mode === 'click-outside' || mode === 'manual' || mode === 'none') {
    e.preventDefault()
  }
  emits('escapeKeyDown', e)
}
</script>

<template>
  <PopoverPortal>
    <PopoverContent
      data-uipkge
      data-slot="popover-content"
      v-bind="{
        ...$attrs,
        ...forwarded,
        onPointerDownOutside,
        onEscapeKeyDown,
      }"
      :class="
        cn(
          'bg-popover text-popover-foreground motion-safe:data-[state=open]:animate-in motion-safe:data-[state=closed]:animate-out motion-safe:data-[state=open]:ease-emphasized motion-safe:data-[state=open]:blur-in-2 motion-safe:data-[state=closed]:blur-out-2 motion-safe:data-[state=closed]:fade-out-0 motion-safe:data-[state=open]:fade-in-0 motion-safe:data-[state=closed]:zoom-out-95 motion-safe:data-[state=open]:zoom-in-95 motion-safe:data-[side=bottom]:slide-in-from-top-2 motion-safe:data-[side=left]:slide-in-from-right-2 motion-safe:data-[side=right]:slide-in-from-left-2 motion-safe:data-[side=top]:slide-in-from-bottom-2 z-50 w-72 origin-(--reka-popover-content-transform-origin) rounded-md border p-4 shadow-md outline-hidden motion-safe:data-[state=closed]:duration-[var(--dur-exit)] motion-safe:data-[state=open]:duration-200',
          props.class,
        )
      "
    >
      <slot />
    </PopoverContent>
  </PopoverPortal>
</template>

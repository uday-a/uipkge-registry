<script setup lang="ts">
import { computed, inject, onMounted, useTemplateRef } from 'vue'
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { SCROLL_SPY_CONTEXT_KEY } from './context'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

const ctx = inject(SCROLL_SPY_CONTEXT_KEY, null)
const listRef = useTemplateRef<HTMLUListElement>('listRef')

const isStraight = computed(() => ctx?.turn.value === 'straight')
const isRightRail = computed(() => ctx?.position.value === 'left' && ctx?.railPosition.value === 'right')
const lineWidthPx = computed(() => `${ctx?.resolvedLineWidth.value ?? 2.5}px`)

onMounted(() => {
  if (ctx && listRef.value) {
    ctx.setListEl(listRef.value)
  }
})
</script>

<template>
  <ul
    ref="listRef"
    data-slot="scroll-spy-list"
    :style="{
      borderLeftWidth: isStraight && !isRightRail ? lineWidthPx : undefined,
      borderRightWidth: isStraight && isRightRail ? lineWidthPx : undefined,
    }"
    :class="
      cn(
        'relative flex flex-col space-y-1 text-sm',
        isStraight && (isRightRail ? 'border-border border-r' : 'border-border border-l'),
        props.class,
      )
    "
  >
    <slot />
  </ul>
</template>

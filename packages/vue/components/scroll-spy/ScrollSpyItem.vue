<script setup lang="ts">
import { computed, inject, onBeforeUnmount, onMounted, provide, ref, useTemplateRef, watch } from 'vue'
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { SCROLL_SPY_CONTEXT_KEY, SCROLL_SPY_ITEM_DEPTH_KEY } from './context'

const props = withDefaults(
  defineProps<{
    value: string
    title?: string
    depth?: number
    class?: HTMLAttributes['class']
  }>(),
  {
    title: undefined,
    depth: undefined,
  },
)

const ctx = inject(SCROLL_SPY_CONTEXT_KEY, null)
const parentDepth = inject(SCROLL_SPY_ITEM_DEPTH_KEY, ref(0))
const computedDepth = computed(() => props.depth ?? parentDepth.value + 1)
provide(SCROLL_SPY_ITEM_DEPTH_KEY, computedDepth)

const itemRef = useTemplateRef<HTMLLIElement>('itemRef')

function register() {
  if (!ctx) return
  ctx.registerItem({
    value: props.value,
    title: props.title,
    depth: computedDepth.value,
    el: itemRef.value,
  })
}

onMounted(() => {
  register()
})

onBeforeUnmount(() => {
  ctx?.unregisterItem(props.value)
})

watch(
  () => [props.value, computedDepth.value] as const,
  ([newVal], [oldVal]) => {
    if (oldVal && oldVal !== newVal) {
      ctx?.unregisterItem(oldVal)
    }
    register()
  },
)
</script>

<template>
  <li
    ref="itemRef"
    data-slot="scroll-spy-item"
    :data-depth="computedDepth"
    :class="cn('relative flex flex-col', props.class)"
  >
    <slot />
  </li>
</template>

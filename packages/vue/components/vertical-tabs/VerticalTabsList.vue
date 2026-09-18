<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { HTMLAttributes } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { TabsList, useForwardProps } from 'reka-ui'
import { cn } from '@/lib/utils'

// Inlined unions: SFC compiler can't extract runtime props from reka-ui types cleanly.
const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes['class']
    asChild?: boolean
    as?: string | object
    loop?: boolean
    /** Enable sliding active indicator (default true). When false, active chrome paints on the trigger. */
    animated?: boolean
  }>(),
  {
    animated: true,
  },
)

const delegated = reactiveOmit(props, 'class', 'animated')
const forwarded = useForwardProps(delegated)

const listEl = ref<HTMLElement | null>(null)
const indicatorStyle = ref<Record<string, string>>({
  opacity: '0',
})
let ro: ResizeObserver | null = null
let mo: MutationObserver | null = null
let firstPosition = true

function resolveListEl(node: unknown): HTMLElement | null {
  if (!node) return null
  if (node instanceof HTMLElement) return node
  // reka-ui may expose a component instance with $el
  const el = (node as { $el?: unknown }).$el
  return el instanceof HTMLElement ? el : null
}

function setListRef(node: unknown) {
  listEl.value = resolveListEl(node)
}

function motionSafeTransition() {
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return 'none'
  }
  return firstPosition
    ? 'none'
    : 'transform 220ms cubic-bezier(0.22, 1, 0.36, 1), width 220ms cubic-bezier(0.22, 1, 0.36, 1), height 220ms cubic-bezier(0.22, 1, 0.36, 1)'
}

function updateIndicator() {
  if (!props.animated) return
  const root = listEl.value
  if (!root) return
  const active = root.querySelector<HTMLElement>('[data-slot="vertical-tabs-trigger"][data-state="active"]')
  if (!active) {
    indicatorStyle.value = { opacity: '0' }
    return
  }

  const listRect = root.getBoundingClientRect()
  const activeRect = active.getBoundingClientRect()
  const left = activeRect.left - listRect.left + root.scrollLeft
  const top = activeRect.top - listRect.top + root.scrollTop
  const transition = motionSafeTransition()

  // Full active surface slides (muted pill); primary rail is nested absolute so it stays inset-y-1.
  indicatorStyle.value = {
    width: `${activeRect.width}px`,
    height: `${activeRect.height}px`,
    transform: `translate3d(${left}px, ${top}px, 0)`,
    opacity: '1',
    transition,
  }
  firstPosition = false
}

function unbindObservers() {
  ro?.disconnect()
  mo?.disconnect()
  ro = null
  mo = null
}

function bindObservers() {
  const root = listEl.value
  if (!root || !props.animated) return

  unbindObservers()

  ro = new ResizeObserver(() => updateIndicator())
  ro.observe(root)
  root.querySelectorAll('[data-slot="vertical-tabs-trigger"]').forEach((el) => ro!.observe(el))

  mo = new MutationObserver((mutations) => {
    // Re-observe new triggers without treating parent re-renders as first paint.
    for (const m of mutations) {
      if (m.type === 'childList') {
        root.querySelectorAll('[data-slot="vertical-tabs-trigger"]').forEach((el) => ro?.observe(el))
      }
    }
    nextTick(updateIndicator)
  })
  mo.observe(root, {
    attributes: true,
    attributeFilter: ['data-state'],
    subtree: true,
    childList: true,
  })

  updateIndicator()
}

onMounted(() => {
  nextTick(() => {
    // reka-ui component ref may resolve a tick later
    if (!listEl.value) {
      requestAnimationFrame(() => bindObservers())
    } else {
      bindObservers()
    }
  })
})

onBeforeUnmount(() => {
  unbindObservers()
})

watch(
  () => props.animated,
  (on) => {
    firstPosition = true
    if (on) nextTick(() => bindObservers())
    else {
      unbindObservers()
      indicatorStyle.value = { opacity: '0' }
    }
  },
)
</script>

<template>
  <TabsList
    :ref="setListRef"
    data-uipkge
    data-slot="vertical-tabs-list"
    :data-animated="animated ? 'true' : 'false'"
    v-bind="forwarded"
    :class="cn('group/list border-border relative flex w-56 shrink-0 flex-col gap-0.5 border-r pr-3', props.class)"
  >
    <span
      v-if="animated"
      data-slot="vertical-tabs-indicator"
      aria-hidden="true"
      class="bg-muted pointer-events-none absolute top-0 left-0 z-0 rounded-md will-change-transform"
      :style="indicatorStyle"
    >
      <!-- Primary rail stays inset relative to the sliding surface (matches prior trigger chrome). -->
      <span class="bg-primary absolute inset-y-1 left-0 w-0.5 rounded-full" />
    </span>
    <slot />
  </TabsList>
</template>

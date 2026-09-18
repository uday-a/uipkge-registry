<script setup lang="ts">
import { computed, inject, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { HTMLAttributes } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { TabsList, useForwardProps } from 'reka-ui'
import { cn } from '@/lib/utils'
import { tabsListVariants } from './tabs.variants'

// Inlined unions: SFC compiler can't extract runtime props from
// indexed-access types or reka-ui's TabsListProps.
const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes['class']
    variant?: 'segmented' | 'pill' | 'underline'
    orientation?: 'horizontal' | 'vertical'
    asChild?: boolean
    as?: string | object
    loop?: boolean
    /** Enable sliding active indicator (default true). When false, active surface paints on the trigger. */
    animated?: boolean
  }>(),
  {
    animated: true,
  },
)

const delegatedProps = reactiveOmit(props, 'class', 'variant', 'orientation', 'animated')
const forwarded = useForwardProps(delegatedProps)

// Inherit orientation from <Tabs> when not set explicitly. Provided as a
// computed ref by Tabs.vue so updates propagate.
const tabsOrientation = inject<{ value: 'horizontal' | 'vertical' } | 'horizontal' | 'vertical'>(
  Symbol.for('tabsOrientation'),
  'horizontal',
)
const effectiveOrientation = computed(() => {
  if (props.orientation) return props.orientation
  return typeof tabsOrientation === 'string' ? tabsOrientation : tabsOrientation.value
})

const variant = computed(() => props.variant ?? 'segmented')

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
  const active = root.querySelector<HTMLElement>('[data-slot="tabs-trigger"][data-state="active"]')
  if (!active) {
    indicatorStyle.value = { opacity: '0' }
    return
  }

  const listRect = root.getBoundingClientRect()
  const activeRect = active.getBoundingClientRect()
  const left = activeRect.left - listRect.left + root.scrollLeft
  const top = activeRect.top - listRect.top + root.scrollTop
  const transition = motionSafeTransition()

  if (variant.value === 'underline') {
    const thickness = 2
    if (effectiveOrientation.value === 'vertical') {
      indicatorStyle.value = {
        width: `${thickness}px`,
        height: `${activeRect.height}px`,
        transform: `translate3d(${listRect.width - thickness}px, ${top}px, 0)`,
        opacity: '1',
        transition,
      }
    } else {
      indicatorStyle.value = {
        width: `${activeRect.width}px`,
        height: `${thickness}px`,
        transform: `translate3d(${left}px, ${listRect.height - thickness}px, 0)`,
        opacity: '1',
        transition,
      }
    }
  } else {
    indicatorStyle.value = {
      width: `${activeRect.width}px`,
      height: `${activeRect.height}px`,
      transform: `translate3d(${left}px, ${top}px, 0)`,
      opacity: '1',
      transition,
    }
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
  root.querySelectorAll('[data-slot="tabs-trigger"]').forEach((el) => ro!.observe(el))

  mo = new MutationObserver((mutations) => {
    // Re-observe new triggers without treating parent re-renders as first paint.
    for (const m of mutations) {
      if (m.type === 'childList') {
        root.querySelectorAll('[data-slot="tabs-trigger"]').forEach((el) => ro?.observe(el))
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
  () => [variant.value, effectiveOrientation.value] as const,
  () => {
    firstPosition = true
    nextTick(updateIndicator)
  },
)

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

const indicatorClass = computed(() => {
  if (variant.value === 'pill') {
    return 'pointer-events-none absolute top-0 left-0 z-0 rounded-full bg-primary shadow-xs will-change-transform'
  }
  if (variant.value === 'underline') {
    return 'pointer-events-none absolute top-0 left-0 z-0 bg-foreground will-change-transform'
  }
  // segmented
  return 'pointer-events-none absolute top-0 left-0 z-0 rounded-sm bg-background shadow-xs will-change-transform'
})
</script>

<template>
  <TabsList
    :ref="setListRef"
    data-uipkge
    data-slot="tabs-list"
    :data-animated="animated ? 'true' : 'false'"
    v-bind="forwarded"
    :class="cn('group/list relative', tabsListVariants({ variant, orientation: effectiveOrientation }), props.class)"
  >
    <span
      v-if="animated"
      data-slot="tabs-indicator"
      aria-hidden="true"
      :class="indicatorClass"
      :style="indicatorStyle"
    />
    <slot />
  </TabsList>
</template>

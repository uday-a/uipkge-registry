<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch, type Component, type HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

export interface BottomNavItem {
  /** Unique value identifying this tab. Used with v-model. */
  value: string
  /** Label shown under the icon. */
  label: string
  /** Lucide icon component. */
  icon: Component
  /** Optional badge count or text shown on the icon. */
  badge?: string | number
  /** Router link destination (use with vue-router). */
  to?: string
}

interface Props {
  /** Tab items. */
  items: BottomNavItem[]
  /** Active item value (v-model). */
  modelValue?: string
  /** Active item color — a Tailwind text color class. Default 'text-primary'. */
  activeColor?: string
  /** Fixed positioning at the viewport bottom. Default true. */
  fixed?: boolean
  /** Show a sliding active indicator pill behind the icon. Default true. */
  showIndicator?: boolean
  /** Safe-area padding for notched devices (iOS). Default true. */
  safeArea?: boolean
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  activeColor: 'text-primary',
  fixed: true,
  showIndicator: true,
  safeArea: true,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  select: [item: BottomNavItem]
}>()

const active = computed(() => props.modelValue)

const navEl = ref<HTMLElement | null>(null)
const indicatorStyle = ref<Record<string, string>>({ opacity: '0' })
let ro: ResizeObserver | null = null
let firstPosition = true

function motionSafeTransition() {
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return 'none'
  }
  return firstPosition
    ? 'none'
    : 'transform 220ms cubic-bezier(0.22, 1, 0.36, 1), width 220ms cubic-bezier(0.22, 1, 0.36, 1), height 220ms cubic-bezier(0.22, 1, 0.36, 1)'
}

function updateIndicator() {
  if (!props.showIndicator) return
  const root = navEl.value
  if (!root) return

  const activeItem = root.querySelector<HTMLElement>('[data-slot="bottom-navigation-item"][data-active]')
  if (!activeItem) {
    indicatorStyle.value = { opacity: '0' }
    return
  }

  const iconWrap = activeItem.querySelector<HTMLElement>('[data-slot="bottom-navigation-icon"]') ?? activeItem
  const rootRect = root.getBoundingClientRect()
  const iconRect = iconWrap.getBoundingClientRect()

  // Compact pill centered on the icon — fixed height keeps motion light; width tracks icon + pad.
  const padX = 14
  const pillH = 32
  const pillW = Math.max(iconRect.width + padX * 2, 56)
  const left = iconRect.left - rootRect.left + root.scrollLeft + (iconRect.width - pillW) / 2
  const top = iconRect.top - rootRect.top + root.scrollTop + (iconRect.height - pillH) / 2
  const transition = motionSafeTransition()

  indicatorStyle.value = {
    width: `${pillW}px`,
    height: `${pillH}px`,
    transform: `translate3d(${left}px, ${top}px, 0)`,
    opacity: '1',
    transition,
  }
  firstPosition = false
}

function unbindObservers() {
  ro?.disconnect()
  ro = null
}

function bindObservers() {
  const root = navEl.value
  if (!root || !props.showIndicator) return

  unbindObservers()
  ro = new ResizeObserver(() => updateIndicator())
  ro.observe(root)
  root.querySelectorAll('[data-slot="bottom-navigation-item"]').forEach((el) => ro!.observe(el))
  updateIndicator()
}

function onSelect(item: BottomNavItem) {
  if (item.to) {
    // Router integration — navigate if vue-router is available
    const router = (window as any).__vueRouter
    if (router) router.push(item.to)
  }
  emit('update:modelValue', item.value)
  emit('select', item)
}

onMounted(() => {
  nextTick(() => bindObservers())
})

onBeforeUnmount(() => {
  unbindObservers()
})

watch(
  () => props.modelValue,
  () => {
    nextTick(updateIndicator)
  },
)

watch(
  () => props.items,
  () => {
    // Remeasure without sliding when the item set changes (count/layout).
    firstPosition = true
    nextTick(() => bindObservers())
  },
  { deep: true },
)

watch(
  () => props.showIndicator,
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
  <nav
    ref="navEl"
    data-uipkge
    data-slot="bottom-navigation"
    aria-label="Bottom navigation"
    :data-fixed="fixed ? '' : undefined"
    :class="
      cn(
        'border-border bg-background/95 z-50 flex items-stretch justify-around border-t backdrop-blur-sm',
        // fixed establishes the containing block for the absolute indicator; relative when in-flow
        fixed ? 'fixed inset-x-0 bottom-0' : 'relative',
        safeArea && 'pb-[env(safe-area-inset-bottom)]',
        props.class,
      )
    "
  >
    <!-- Single sliding pill; transform-only for cheap mobile paint -->
    <span
      v-if="showIndicator"
      data-slot="bottom-navigation-indicator"
      aria-hidden="true"
      class="bg-primary/10 pointer-events-none absolute top-0 left-0 z-0 rounded-full will-change-transform"
      :style="indicatorStyle"
    />

    <button
      v-for="item in items"
      :key="item.value"
      data-slot="bottom-navigation-item"
      :data-active="active === item.value ? '' : undefined"
      :aria-current="active === item.value ? 'page' : undefined"
      type="button"
      class="focus-visible:ring-ring/50 relative z-10 flex min-h-12 flex-1 flex-col items-center justify-center gap-0.5 pt-2 pb-1.5 text-xs transition-colors duration-200 outline-none focus-visible:ring-[3px] motion-reduce:transition-none"
      :class="active === item.value ? activeColor : 'text-muted-foreground hover:text-foreground'"
      @click="onSelect(item)"
    >
      <span data-slot="bottom-navigation-icon" class="relative flex items-center justify-center">
        <component
          :is="item.icon"
          class="size-5 transition-[transform,opacity] duration-200 ease-out motion-reduce:transition-none"
          :class="active === item.value ? 'scale-110' : 'scale-100'"
        />
        <span
          v-if="item.badge !== undefined && item.badge !== ''"
          class="bg-destructive text-destructive-foreground absolute -top-1.5 -right-2 flex min-w-4 items-center justify-center rounded-full px-1 text-xs leading-4 font-medium"
        >
          {{ item.badge }}
        </span>
      </span>
      <span
        class="max-w-full truncate px-1 transition-[opacity,font-weight] duration-200 motion-reduce:transition-none"
        :class="active === item.value ? 'font-medium' : 'font-normal'"
      >
        {{ item.label }}
      </span>
    </button>
  </nav>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import type { Component, HTMLAttributes } from 'vue'

// Self-contained icon-swap control. Click runs an optional async `action`,
// then flips from `defaultIcon` to `activeIcon` with a spring pop. By default
// it auto-reverts after 1500ms; pass `:resetAfter="0"` to keep the active
// icon, then call `iconRef.value.reset()` manually.
//
// Two operating modes:
//   1. Self-managed (most common): pass `defaultIcon`, `activeIcon`, and
//      either `action` or just listen to `@activate`. The component runs
//      the action, manages its own `active` state, and auto-resets.
//   2. Externally controlled: pass `:active="boolean"` and the component
//      will mirror that prop, ignoring its internal flag.
//
// Renders as a <button> by default. Pass `as="span"` for a non-interactive
// icon (e.g. inside a parent button) — in that mode the parent is responsible
// for triggering `trigger()` via the exposed ref.

const props = withDefaults(
  defineProps<{
    defaultIcon: Component
    activeIcon: Component
    /** Tailwind size/color applied to the icons. */
    iconClass?: HTMLAttributes['class']
    /** Async work executed on click before the icon flips. Return `false` to skip the flip. */
    action?: () => boolean | void | Promise<boolean | void>
    /** ms before reverting to defaultIcon. Set to `0` (or null) to stay active. */
    resetAfter?: number | null
    /** Pop animation duration in ms (also scales the leave fade). */
    duration?: number
    /** aria-label shown in default state. */
    label?: string
    /** aria-label shown after activation; falls back to `label`. */
    activeLabel?: string
    /** Tailwind class applied while active (e.g. "text-success"). */
    activeClass?: string
    /** Render element. `button` adds click handler + focus styling; `span` is purely visual. */
    as?: 'button' | 'span'
    /** External control. When provided, this prop wins over internal state. */
    active?: boolean
  }>(),
  {
    iconClass: 'size-4',
    resetAfter: 1500,
    duration: 240,
    activeClass: 'text-success',
    as: 'button',
    active: undefined,
  },
)

const emit = defineEmits<{
  activate: []
  reset: []
}>()

const internalActive = ref(false)
const isActive = computed(() => (props.active !== undefined ? props.active : internalActive.value))

let timer: ReturnType<typeof setTimeout> | null = null

async function trigger() {
  if (props.action) {
    const result = await props.action()
    if (result === false) return
  }
  internalActive.value = true
  emit('activate')
  clearTimer()
  if (props.resetAfter && props.resetAfter > 0) {
    timer = setTimeout(reset, props.resetAfter)
  }
}

function reset() {
  internalActive.value = false
  emit('reset')
  clearTimer()
}

function clearTimer() {
  if (timer) {
    clearTimeout(timer)
    timer = null
  }
}

defineExpose({ trigger, reset })

onBeforeUnmount(clearTimer)
</script>

<template>
  <component
    :is="as"
    data-uipkge
    data-slot="icon-transition"
    v-bind="as === 'button' ? { type: 'button' } : {}"
    :aria-label="isActive ? (activeLabel ?? label) : label"
    :aria-live="isActive ? 'polite' : undefined"
    :class="[
      'icon-transition focus-visible:ring-ring inline-grid place-items-center transition-colors focus-visible:ring-2 focus-visible:outline-none',
      isActive ? activeClass : '',
    ]"
    :style="{ '--it-duration': `${duration}ms` }"
    @click="as === 'button' ? trigger() : null"
  >
    <Transition name="icon-transition" mode="default">
      <!-- Wrapping span isolates the absolute-positioning + transform from
        the icon itself. Putting position:absolute + inset:0 directly on the
        SVG would stretch it to fill the parent (e.g. 28×28 inside a size-7
        button) and the icon would visually balloon mid-transition; the
        wrapper takes the layout role and the SVG keeps its intrinsic
        iconClass-driven size. -->
      <span :key="isActive ? 'active' : 'default'" class="icon-transition-slot">
        <component :is="isActive ? activeIcon : defaultIcon" :class="iconClass" aria-hidden="true" />
      </span>
    </Transition>
  </component>
</template>

<style scoped>
.icon-transition-slot {
  /* Both default and active icons map to the same grid cell so they can
     overlap during the cross-fade without ever leaving the parent's flow.
     No `position: absolute` here — that would have to inset:0 the slot,
     stretching it to the button size and dragging the SVG along with it. */
  grid-area: 1 / 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.icon-transition-enter-active,
.icon-transition-leave-active {
  transform-origin: center;
}
.icon-transition-enter-active {
  animation: icon-transition-pop var(--it-duration, 240ms) cubic-bezier(0.34, 1.56, 0.64, 1) both;
}
.icon-transition-leave-active {
  animation: icon-transition-fade calc(var(--it-duration, 240ms) * 0.66) ease-in both;
}
@keyframes icon-transition-pop {
  0% {
    opacity: 0;
    transform: scale(0.5) rotate(-12deg);
  }
  60% {
    opacity: 1;
    transform: scale(1.18) rotate(2deg);
  }
  100% {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }
}
@keyframes icon-transition-fade {
  to {
    opacity: 0;
    transform: scale(0.85);
  }
}
@media (prefers-reduced-motion: reduce) {
  .icon-transition-enter-active,
  .icon-transition-leave-active {
    animation-duration: 0ms !important;
  }
}
</style>

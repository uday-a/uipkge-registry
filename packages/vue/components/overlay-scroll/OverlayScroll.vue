<script setup lang="ts">
import { onMounted, onScopeDispose, ref } from 'vue'
import { cn } from '@/lib/utils'

// Slack-style overlay scrollbar. Hides the native scrollbar entirely so the
// scrolled content uses the full container width (no reservation), then draws
// a thin auto-fading thumb absolutely positioned on top. Drag-to-scroll on the
// thumb is supported via Pointer Events (mouse + touch + pen). Vertical only.
//
// Give the component a bounded height via the parent (e.g. `flex-1 min-h-0`
// inside a flex column, or a fixed `h-*` / `max-h-*`). Without a bound it
// expands to its content and the thumb is hidden.
const props = withDefaults(
  defineProps<{
    // Thumb width in px when idle. Expands to ~2x on hover / drag.
    thumbWidth?: number
    // Right offset of the thumb from the inner edge, in px.
    thumbOffset?: number
    // ms of scroll inactivity before the thumb fades.
    idleHideMs?: number
    // Allow dragging the thumb to scroll.
    draggable?: boolean
    // Tailwind classes forwarded to the outer wrapper.
    class?: string
  }>(),
  {
    thumbWidth: 4,
    thumbOffset: 2,
    idleHideMs: 800,
    draggable: true,
  },
)

const scrollerEl = ref<HTMLElement | null>(null)
const thumbEl = ref<HTMLElement | null>(null)
const thumbHeight = ref(0)
const thumbTop = ref(0)
const showThumb = ref(false)
const isHovered = ref(false)
const isDragging = ref(false)
let hideTimer: ReturnType<typeof setTimeout> | null = null

const recompute = () => {
  const el = scrollerEl.value
  if (!el) return
  const ratio = el.clientHeight / el.scrollHeight
  if (!Number.isFinite(ratio) || ratio >= 1) {
    thumbHeight.value = 0
    return
  }
  thumbHeight.value = Math.max(24, el.clientHeight * ratio)
  const maxScroll = el.scrollHeight - el.clientHeight
  const maxThumb = el.clientHeight - thumbHeight.value
  thumbTop.value = maxScroll > 0 ? (el.scrollTop / maxScroll) * maxThumb : 0
}

const flashThumb = () => {
  if (thumbHeight.value === 0) return
  showThumb.value = true
  if (hideTimer) clearTimeout(hideTimer)
  hideTimer = setTimeout(() => {
    if (!isHovered.value && !isDragging.value) showThumb.value = false
  }, props.idleHideMs)
}

const onScroll = () => {
  recompute()
  flashThumb()
}

const onEnter = () => {
  isHovered.value = true
  recompute()
  if (thumbHeight.value > 0) showThumb.value = true
}

const onLeave = () => {
  isHovered.value = false
  if (isDragging.value) return
  if (hideTimer) clearTimeout(hideTimer)
  showThumb.value = false
}

// Pointer Events cover mouse + touch + pen on every modern browser
// (Chrome 55+, Firefox 59+, Safari 13+, Edge). setPointerCapture keeps the
// drag alive even if the pointer leaves the thumb, matching native feel.
let activePointerId: number | null = null
let dragStartY = 0
let dragStartScrollTop = 0

const onPointerMove = (e: PointerEvent) => {
  if (activePointerId !== e.pointerId) return
  const el = scrollerEl.value
  if (!el) return
  const maxScroll = el.scrollHeight - el.clientHeight
  const maxThumb = el.clientHeight - thumbHeight.value
  if (maxThumb <= 0) return
  const scrollRatio = maxScroll / maxThumb
  el.scrollTop = dragStartScrollTop + (e.clientY - dragStartY) * scrollRatio
}

const endDrag = (e?: PointerEvent) => {
  if (e && activePointerId !== e.pointerId) return
  isDragging.value = false
  if (thumbEl.value && activePointerId !== null) {
    try {
      thumbEl.value.releasePointerCapture(activePointerId)
    } catch {
      // pointer may already be released; ignore
    }
  }
  activePointerId = null
  thumbEl.value?.removeEventListener('pointermove', onPointerMove)
  thumbEl.value?.removeEventListener('pointerup', endDrag)
  thumbEl.value?.removeEventListener('pointercancel', endDrag)
  if (!isHovered.value) showThumb.value = false
}

const onThumbPointerDown = (e: PointerEvent) => {
  if (!props.draggable || !scrollerEl.value || !thumbEl.value) return
  if (e.pointerType === 'mouse' && e.button !== 0) return
  e.preventDefault()
  isDragging.value = true
  activePointerId = e.pointerId
  dragStartY = e.clientY
  dragStartScrollTop = scrollerEl.value.scrollTop
  thumbEl.value.setPointerCapture(e.pointerId)
  thumbEl.value.addEventListener('pointermove', onPointerMove)
  thumbEl.value.addEventListener('pointerup', endDrag)
  thumbEl.value.addEventListener('pointercancel', endDrag)
}

let resizeObserver: ResizeObserver | null = null
let mutationObserver: MutationObserver | null = null

onMounted(() => {
  recompute()
  if (!scrollerEl.value) return

  resizeObserver = new ResizeObserver(recompute)
  resizeObserver.observe(scrollerEl.value)

  const inner = scrollerEl.value.firstElementChild as HTMLElement | null
  if (inner) {
    resizeObserver.observe(inner)
    mutationObserver = new MutationObserver(recompute)
    mutationObserver.observe(inner, { childList: true, subtree: true })
  }
})

onScopeDispose(() => {
  resizeObserver?.disconnect()
  mutationObserver?.disconnect()
  if (hideTimer) clearTimeout(hideTimer)
  endDrag()
})

defineExpose({
  // Underlying scroller DOM element; call .scrollTo() on it from a parent.
  scrollerEl,
  // Force thumb recalc after a non-DOM size change.
  recompute,
})
</script>

<template>
  <div
    data-uipkge
    data-slot="overlay-scroll"
    :class="cn('overlay-scroll relative', props.class)"
    @mouseenter="onEnter"
    @mouseleave="onLeave"
  >
    <div
      ref="scrollerEl"
      data-slot="overlay-scroll-viewport"
      class="overlay-scroll__inner h-full overflow-x-hidden overflow-y-auto"
      @scroll="onScroll"
    >
      <slot />
    </div>
    <div
      ref="thumbEl"
      data-slot="overlay-scroll-thumb"
      class="overlay-scroll__thumb"
      aria-hidden="true"
      :class="{
        'overlay-scroll__thumb--visible': showThumb,
        'overlay-scroll__thumb--dragging': isDragging,
        'overlay-scroll__thumb--draggable': draggable,
      }"
      :style="{
        width: `${thumbWidth}px`,
        /* Read the right offset from --ovs-thumb-right when an ancestor
           sets it (e.g. Sidebar pushes the thumb away from SidebarRail),
           otherwise fall back to the prop. Lets the same primitive sit
           flush in a card AND clear a rail without per-call config. */
        right: `var(--ovs-thumb-right, ${thumbOffset}px)`,
        height: `${thumbHeight}px`,
        transform: `translateY(${thumbTop}px)`,
      }"
      @pointerdown="onThumbPointerDown"
    />
  </div>
</template>

<style scoped>
.overlay-scroll__inner {
  scrollbar-width: none;
  -ms-overflow-style: none;
  /* Stop wheel events from chaining to the page once the inner scroller
     hits its top/bottom. Without this, scrolling a long activity feed
     past its last item keeps scrolling the surrounding page — confusing
     when the inner region is a clearly bounded card. */
  overscroll-behavior: contain;
}
.overlay-scroll__inner::-webkit-scrollbar {
  display: none;
  width: 0;
  height: 0;
}
.overlay-scroll__thumb {
  position: absolute;
  top: 0;
  border-radius: 2px;
  background: var(--muted-foreground);
  opacity: 0;
  pointer-events: none;
  touch-action: none;
  user-select: none;
  -webkit-user-select: none;
  transition:
    opacity 0.2s ease,
    background-color 0.15s,
    width 0.12s ease;
  will-change: transform, opacity;
}
.overlay-scroll__thumb--draggable {
  cursor: pointer;
}
.overlay-scroll__thumb--visible {
  opacity: 0.4;
  pointer-events: auto;
}
.overlay-scroll:hover .overlay-scroll__thumb--visible {
  opacity: 0.6;
}
.overlay-scroll:hover .overlay-scroll__thumb--draggable:hover {
  opacity: 0.8;
  width: 8px !important;
  background: var(--foreground);
}
.overlay-scroll__thumb--dragging {
  opacity: 1 !important;
  background: var(--foreground) !important;
  width: 8px !important;
}
</style>

<script setup lang="ts" generic="T = any">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { HTMLAttributes } from 'vue'
import { Loader2 } from 'lucide-vue-next'
import { cn } from '@/lib/utils'

const props = withDefaults(
  defineProps<{
    /** Rendered list. The component does not mutate it; the parent appends
     *  new items in response to the `load` event. */
    items?: T[]
    /** When false, the sentinel never fires `load` (end of data reached). */
    hasMore?: boolean
    /** True while the parent is fetching. While true the sentinel is paused
     *  so duplicate loads are not emitted. */
    loading?: boolean
    /** Distance (px) from the boundary at which `load` fires. Larger = earlier. */
    distance?: number
    /** Scroll container. `"window"` listens on the viewport; pass an element
     *  ref (HTMLElement) or a CSS selector string to listen on a scrollable
     *  element instead. */
    scrollTarget?: 'window' | HTMLElement | string
    /** Reverse mode: prepend items at the top. The sentinel is anchored to the
     *  top edge and `load` fires when the user scrolls near the top. */
    reverse?: boolean
    /** Hard pause independent of `loading`/`hasMore`. */
    disabled?: boolean
    /** Hide the default loading spinner (use the `loading` slot instead). */
    hideSpinner?: boolean
    class?: HTMLAttributes['class']
  }>(),
  {
    items: () => [] as T[],
    hasMore: true,
    loading: false,
    distance: 0,
    scrollTarget: 'window',
    reverse: false,
    disabled: false,
    hideSpinner: false,
  },
)

const emit = defineEmits<{
  (e: 'load'): void
}>()

const sentinel = ref<HTMLElement | null>(null)
let scrollEl: HTMLElement | Window | null = null

const showSpinner = computed(() => props.loading && !props.hideSpinner)

function getScrollElement(): HTMLElement | Window | null {
  if (props.scrollTarget === 'window') return window
  if (typeof props.scrollTarget === 'string') {
    return (document.querySelector(props.scrollTarget) as HTMLElement | null) ?? window
  }
  return props.scrollTarget
}

function check() {
  if (props.disabled || props.loading || !props.hasMore || !sentinel.value) return
  const sentinelRect = sentinel.value.getBoundingClientRect()
  // When listening on a scrollable element, use that element's visible box —
  // not the window — otherwise a short/offset container never (or always)
  // trips the threshold relative to the viewport.
  let edgeTop = 0
  let edgeBottom = window.innerHeight || document.documentElement.clientHeight
  if (scrollEl && scrollEl !== window) {
    const r = (scrollEl as HTMLElement).getBoundingClientRect()
    edgeTop = r.top
    edgeBottom = r.bottom
  }
  if (props.reverse) {
    // Reverse: fire when the sentinel (anchored at top) approaches the top edge.
    if (sentinelRect.bottom >= edgeTop - props.distance && sentinelRect.top <= edgeBottom) {
      emit('load')
    }
  } else {
    // Forward: fire when the sentinel approaches the bottom edge.
    if (sentinelRect.top <= edgeBottom + props.distance && sentinelRect.bottom >= edgeTop - props.distance) {
      emit('load')
    }
  }
}

function onScroll() {
  check()
}

onMounted(() => {
  scrollEl = getScrollElement()
  scrollEl?.addEventListener('scroll', onScroll, { passive: true })
  // Fire once on mount so an initially-empty list starts loading immediately.
  check()
})

onBeforeUnmount(() => {
  scrollEl?.removeEventListener('scroll', onScroll)
})

// Re-bind the listener when the scroll target changes.
watch(
  () => props.scrollTarget,
  () => {
    scrollEl?.removeEventListener('scroll', onScroll)
    scrollEl = getScrollElement()
    scrollEl?.addEventListener('scroll', onScroll, { passive: true })
    check()
  },
)

// When a load completes (loading flips false) and there is still more data,
// re-check in case the viewport is still larger than the content (short list).
watch(
  () => props.loading,
  (now, was) => {
    if (was && !now && props.hasMore) {
      requestAnimationFrame(check)
    }
  },
)
</script>

<template>
  <div data-uipkge data-slot="infinite-scroll" :class="cn('w-full', props.class)">
    <!-- Reverse mode: spinner + sentinel sit above the items so new rows
         prepend naturally without shifting the scroll position. -->
    <template v-if="reverse">
      <div v-if="showSpinner" data-slot="infinite-scroll-loading" class="flex w-full justify-center py-3">
        <slot name="loading">
          <Loader2 class="text-muted-foreground size-5 animate-spin" aria-label="Loading" />
        </slot>
      </div>
      <div ref="sentinel" data-slot="infinite-scroll-sentinel" class="h-px w-full" aria-hidden="true" />
      <slot :items="items" />
    </template>

    <template v-else>
      <slot :items="items" />
      <div ref="sentinel" data-slot="infinite-scroll-sentinel" class="h-px w-full" aria-hidden="true" />
      <div v-if="showSpinner" data-slot="infinite-scroll-loading" class="flex w-full justify-center py-3">
        <slot name="loading">
          <Loader2 class="text-muted-foreground size-5 animate-spin" aria-label="Loading" />
        </slot>
      </div>
      <div
        v-if="!hasMore && !loading"
        data-slot="infinite-scroll-end"
        class="text-muted-foreground w-full py-3 text-center text-xs"
      >
        <slot name="end">No more items</slot>
      </div>
    </template>
  </div>
</template>

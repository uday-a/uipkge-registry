<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface OverlayScrollProps extends HTMLAttributes<HTMLDivElement> {
    /** Thumb width in px when idle. Expands to ~2x on hover / drag. */
    thumbWidth?: number
    /** Right offset of the thumb from the inner edge, in px. */
    thumbOffset?: number
    /** ms of scroll inactivity before the thumb fades. */
    idleHideMs?: number
    /** Allow dragging the thumb to scroll. */
    draggable?: boolean
    ref?: HTMLDivElement | null
  }

  /** Imperative handle — grab it with `bind:this` and call `getScroller` /
   *  `recompute` directly. Mirrors the React `OverlayScrollHandle`. */
  export interface OverlayScrollHandle {
    /** Underlying scroller DOM element; call .scrollTo() on it from a parent. */
    getScroller: () => HTMLElement | null
    /** Force thumb recalc after a non-DOM size change. */
    recompute: () => void
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  // Slack-style overlay scrollbar. Hides the native scrollbar entirely so the
  // scrolled content uses the full container width (no reservation), then draws
  // a thin auto-fading thumb absolutely positioned on top. Drag-to-scroll on the
  // thumb is supported via Pointer Events (mouse + touch + pen). Vertical only.
  //
  // Give the component a bounded height via the parent (e.g. `flex-1 min-h-0`
  // inside a flex column, or a fixed `h-*` / `max-h-*`). Without a bound it
  // expands to its content and the thumb is hidden.
  let {
    class: className,
    thumbWidth = 4,
    thumbOffset = 2,
    idleHideMs = 800,
    draggable = true,
    children,
    ref = $bindable(null),
    onmouseenter,
    onmouseleave,
    ...restProps
  }: OverlayScrollProps = $props()

  let scrollerEl: HTMLElement | null = $state(null)
  let thumbEl: HTMLElement | null = $state(null)
  let thumbHeight = $state(0)
  let thumbTop = $state(0)
  let showThumb = $state(false)
  let isHovered = $state(false)
  let isDragging = $state(false)
  let hideTimer: ReturnType<typeof setTimeout> | null = null

  function recompute() {
    const el = scrollerEl
    if (!el) return
    const ratio = el.clientHeight / el.scrollHeight
    if (!Number.isFinite(ratio) || ratio >= 1) {
      thumbHeight = 0
      return
    }
    thumbHeight = Math.max(24, el.clientHeight * ratio)
    const maxScroll = el.scrollHeight - el.clientHeight
    const maxThumb = el.clientHeight - thumbHeight
    thumbTop = maxScroll > 0 ? (el.scrollTop / maxScroll) * maxThumb : 0
  }

  function flashThumb() {
    if (thumbHeight === 0) return
    showThumb = true
    if (hideTimer) clearTimeout(hideTimer)
    hideTimer = setTimeout(() => {
      if (!isHovered && !isDragging) showThumb = false
    }, idleHideMs)
  }

  function onScroll() {
    recompute()
    flashThumb()
  }

  function onEnter(e: MouseEvent & { currentTarget: EventTarget & HTMLDivElement }) {
    isHovered = true
    recompute()
    if (thumbHeight > 0) showThumb = true
    onmouseenter?.(e)
  }

  function onLeave(e: MouseEvent & { currentTarget: EventTarget & HTMLDivElement }) {
    isHovered = false
    if (isDragging) {
      onmouseleave?.(e)
      return
    }
    if (hideTimer) clearTimeout(hideTimer)
    showThumb = false
    onmouseleave?.(e)
  }

  // Pointer Events cover mouse + touch + pen on every modern browser
  // (Chrome 55+, Firefox 59+, Safari 13+, Edge). setPointerCapture keeps the
  // drag alive even if the pointer leaves the thumb, matching native feel.
  let activePointerId: number | null = null
  let dragStartY = 0
  let dragStartScrollTop = 0

  function onPointerMove(e: PointerEvent) {
    if (activePointerId !== e.pointerId) return
    const el = scrollerEl
    if (!el) return
    const maxScroll = el.scrollHeight - el.clientHeight
    const maxThumb = el.clientHeight - thumbHeight
    if (maxThumb <= 0) return
    const scrollRatio = maxScroll / maxThumb
    el.scrollTop = dragStartScrollTop + (e.clientY - dragStartY) * scrollRatio
  }

  function endDrag(e?: PointerEvent) {
    if (e && activePointerId !== e.pointerId) return
    isDragging = false
    if (thumbEl && activePointerId !== null) {
      try {
        thumbEl.releasePointerCapture(activePointerId)
      } catch {
        // pointer may already be released; ignore
      }
    }
    activePointerId = null
    thumbEl?.removeEventListener('pointermove', onPointerMove)
    thumbEl?.removeEventListener('pointerup', endDrag as EventListener)
    thumbEl?.removeEventListener('pointercancel', endDrag as EventListener)
    if (!isHovered) showThumb = false
  }

  function onThumbPointerDown(e: PointerEvent & { currentTarget: EventTarget & HTMLDivElement }) {
    if (!draggable || !scrollerEl || !thumbEl) return
    if (e.pointerType === 'mouse' && e.button !== 0) return
    e.preventDefault()
    isDragging = true
    activePointerId = e.pointerId
    dragStartY = e.clientY
    dragStartScrollTop = scrollerEl.scrollTop
    thumbEl.setPointerCapture(e.pointerId)
    thumbEl.addEventListener('pointermove', onPointerMove)
    thumbEl.addEventListener('pointerup', endDrag as EventListener)
    thumbEl.addEventListener('pointercancel', endDrag as EventListener)
  }

  $effect(() => {
    recompute()
    if (!scrollerEl) return

    const resizeObserver = new ResizeObserver(recompute)
    resizeObserver.observe(scrollerEl)

    const inner = scrollerEl.firstElementChild as HTMLElement | null
    let mutationObserver: MutationObserver | null = null
    if (inner) {
      resizeObserver.observe(inner)
      mutationObserver = new MutationObserver(recompute)
      mutationObserver.observe(inner, { childList: true, subtree: true })
    }

    return () => {
      resizeObserver.disconnect()
      mutationObserver?.disconnect()
      if (hideTimer) clearTimeout(hideTimer)
      endDrag()
    }
  })

  /** Underlying scroller DOM element; call .scrollTo() on it from a parent. */
  export function getScroller(): HTMLElement | null {
    return scrollerEl
  }

  /** Force thumb recalc after a non-DOM size change. */
  export { recompute }
</script>

<div
  bind:this={ref}
  data-uipkge=""
  data-slot="overlay-scroll"
  class={cn('overlay-scroll relative', className)}
  onmouseenter={onEnter}
  onmouseleave={onLeave}
  {...restProps}
>
  <div
    bind:this={scrollerEl}
    data-slot="overlay-scroll-viewport"
    class="overlay-scroll__inner h-full overflow-x-hidden overflow-y-auto"
    onscroll={onScroll}
  >
    {@render children?.()}
  </div>
  <div
    bind:this={thumbEl}
    data-slot="overlay-scroll-thumb"
    class={cn(
      'overlay-scroll__thumb',
      showThumb && 'overlay-scroll__thumb--visible',
      isDragging && 'overlay-scroll__thumb--dragging',
      draggable && 'overlay-scroll__thumb--draggable',
    )}
    aria-hidden="true"
    style:width="{thumbWidth}px"
    style:right="var(--ovs-thumb-right, {thumbOffset}px)"
    style:height="{thumbHeight}px"
    style:transform="translateY({thumbTop}px)"
    onpointerdown={onThumbPointerDown}
  ></div>
</div>

<style>
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
  /* NOTE: Svelte scopes `:hover` on the root class to this component's own
     markup, matching the Vue `scoped` behaviour. */
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

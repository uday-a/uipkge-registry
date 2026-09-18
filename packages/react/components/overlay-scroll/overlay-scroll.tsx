'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

// Slack-style overlay scrollbar. Hides the native scrollbar entirely so the
// scrolled content uses the full container width (no reservation), then draws
// a thin auto-fading thumb absolutely positioned on top. Drag-to-scroll on the
// thumb is supported via Pointer Events (mouse + touch + pen). Vertical only.
//
// Give the component a bounded height via the parent (e.g. `flex-1 min-h-0`
// inside a flex column, or a fixed `h-*` / `max-h-*`). Without a bound it
// expands to its content and the thumb is hidden.

// Ported from OverlayScroll.vue's <style scoped> block. Injected once so the
// component ships self-contained (Tailwind has no equivalent overlay-scrollbar
// utility). Class names match the Vue source 1:1.
const overlayScrollCss = `
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
`

function OverlayScrollStyle() {
  return <style dangerouslySetInnerHTML={{ __html: overlayScrollCss }} />
}

export interface OverlayScrollHandle {
  /** Underlying scroller DOM element; call .scrollTo() on it from a parent. */
  scrollerEl: HTMLElement | null
  /** Force thumb recalc after a non-DOM size change. */
  recompute: () => void
}

export interface OverlayScrollProps {
  /** Thumb width in px when idle. Expands to ~2x on hover / drag. */
  thumbWidth?: number
  /** Right offset of the thumb from the inner edge, in px. */
  thumbOffset?: number
  /** ms of scroll inactivity before the thumb fades. */
  idleHideMs?: number
  /** Allow dragging the thumb to scroll. */
  draggable?: boolean
  /** Tailwind classes forwarded to the outer wrapper. */
  className?: string
  children?: React.ReactNode
}

const OverlayScroll = React.forwardRef<OverlayScrollHandle, OverlayScrollProps>(
  ({ thumbWidth = 4, thumbOffset = 2, idleHideMs = 800, draggable = true, className, children }, ref) => {
    const scrollerRef = React.useRef<HTMLDivElement | null>(null)
    const thumbRef = React.useRef<HTMLDivElement | null>(null)

    const [thumbHeight, setThumbHeight] = React.useState(0)
    const [thumbTop, setThumbTop] = React.useState(0)
    const [showThumb, setShowThumb] = React.useState(false)
    const [isDragging, setIsDragging] = React.useState(false)

    // Refs that hold the latest value for callbacks bound once (no re-bind on
    // every render). Mirrors the Vue refs that the closures read directly.
    const isHoveredRef = React.useRef(false)
    const isDraggingRef = React.useRef(false)
    const thumbHeightRef = React.useRef(0)
    const hideTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)
    const idleHideMsRef = React.useRef(idleHideMs)
    const draggableRef = React.useRef(draggable)

    React.useEffect(() => {
      idleHideMsRef.current = idleHideMs
    }, [idleHideMs])
    React.useEffect(() => {
      draggableRef.current = draggable
    }, [draggable])

    const recompute = React.useCallback(() => {
      const el = scrollerRef.current
      if (!el) return
      const ratio = el.clientHeight / el.scrollHeight
      if (!Number.isFinite(ratio) || ratio >= 1) {
        thumbHeightRef.current = 0
        setThumbHeight(0)
        return
      }
      const h = Math.max(24, el.clientHeight * ratio)
      thumbHeightRef.current = h
      setThumbHeight(h)
      const maxScroll = el.scrollHeight - el.clientHeight
      const maxThumb = el.clientHeight - h
      setThumbTop(maxScroll > 0 ? (el.scrollTop / maxScroll) * maxThumb : 0)
    }, [])

    const flashThumb = React.useCallback(() => {
      if (thumbHeightRef.current === 0) return
      setShowThumb(true)
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
      hideTimerRef.current = setTimeout(() => {
        if (!isHoveredRef.current && !isDraggingRef.current) setShowThumb(false)
      }, idleHideMsRef.current)
    }, [])

    const onScroll = React.useCallback(() => {
      recompute()
      flashThumb()
    }, [recompute, flashThumb])

    const onEnter = React.useCallback(() => {
      isHoveredRef.current = true
      recompute()
      if (thumbHeightRef.current > 0) setShowThumb(true)
    }, [recompute])

    const onLeave = React.useCallback(() => {
      isHoveredRef.current = false
      if (isDraggingRef.current) return
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
      setShowThumb(false)
    }, [])

    // Pointer Events cover mouse + touch + pen on every modern browser
    // (Chrome 55+, Firefox 59+, Safari 13+, Edge). setPointerCapture keeps the
    // drag alive even if the pointer leaves the thumb, matching native feel.
    const activePointerIdRef = React.useRef<number | null>(null)
    const dragStartYRef = React.useRef(0)
    const dragStartScrollTopRef = React.useRef(0)

    const onPointerMove = React.useCallback((e: PointerEvent) => {
      if (activePointerIdRef.current !== e.pointerId) return
      const el = scrollerRef.current
      if (!el) return
      const maxScroll = el.scrollHeight - el.clientHeight
      const maxThumb = el.clientHeight - thumbHeightRef.current
      if (maxThumb <= 0) return
      const scrollRatio = maxScroll / maxThumb
      el.scrollTop = dragStartScrollTopRef.current + (e.clientY - dragStartYRef.current) * scrollRatio
    }, [])

    const endDragRef = React.useRef<(e?: PointerEvent) => void>(() => {})

    const endDrag = React.useCallback(
      (e?: PointerEvent) => {
        if (e && activePointerIdRef.current !== e.pointerId) return
        isDraggingRef.current = false
        setIsDragging(false)
        if (thumbRef.current && activePointerIdRef.current !== null) {
          try {
            thumbRef.current.releasePointerCapture(activePointerIdRef.current)
          } catch {
            // pointer may already be released; ignore
          }
        }
        activePointerIdRef.current = null
        const handler = endDragRef.current
        thumbRef.current?.removeEventListener('pointermove', onPointerMove)
        thumbRef.current?.removeEventListener('pointerup', handler)
        thumbRef.current?.removeEventListener('pointercancel', handler)
        if (!isHoveredRef.current) setShowThumb(false)
      },
      [onPointerMove],
    )

    React.useLayoutEffect(() => {
      endDragRef.current = endDrag
    }, [endDrag])

    const onThumbPointerDown = React.useCallback(
      (e: React.PointerEvent) => {
        if (!draggableRef.current || !scrollerRef.current || !thumbRef.current) return
        if (e.pointerType === 'mouse' && e.button !== 0) return
        e.preventDefault()
        isDraggingRef.current = true
        setIsDragging(true)
        activePointerIdRef.current = e.pointerId
        dragStartYRef.current = e.clientY
        dragStartScrollTopRef.current = scrollerRef.current.scrollTop
        thumbRef.current.setPointerCapture(e.pointerId)
        thumbRef.current.addEventListener('pointermove', onPointerMove)
        thumbRef.current.addEventListener('pointerup', endDrag)
        thumbRef.current.addEventListener('pointercancel', endDrag)
      },
      [onPointerMove, endDrag],
    )

    React.useEffect(() => {
      recompute()
      const scroller = scrollerRef.current
      if (!scroller) return

      const resizeObserver = new ResizeObserver(recompute)
      resizeObserver.observe(scroller)

      const inner = scroller.firstElementChild as HTMLElement | null
      let mutationObserver: MutationObserver | null = null
      if (inner) {
        resizeObserver.observe(inner)
        mutationObserver = new MutationObserver(recompute)
        mutationObserver.observe(inner, { childList: true, subtree: true })
      }

      return () => {
        resizeObserver.disconnect()
        mutationObserver?.disconnect()
        if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
        endDrag()
      }
    }, [recompute, endDrag])

    React.useImperativeHandle(
      ref,
      () => ({
        get scrollerEl() {
          return scrollerRef.current
        },
        recompute,
      }),
      [recompute],
    )

    return (
      <div
        data-uipkge=""
        data-slot="overlay-scroll"
        className={cn('overlay-scroll relative', className)}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
      >
        <OverlayScrollStyle />
        <div
          ref={scrollerRef}
          data-slot="overlay-scroll-viewport"
          className="overlay-scroll__inner h-full overflow-x-hidden overflow-y-auto"
          onScroll={onScroll}
        >
          {children}
        </div>
        <div
          ref={thumbRef}
          data-slot="overlay-scroll-thumb"
          aria-hidden="true"
          className={cn(
            'overlay-scroll__thumb',
            showThumb && 'overlay-scroll__thumb--visible',
            isDragging && 'overlay-scroll__thumb--dragging',
            draggable && 'overlay-scroll__thumb--draggable',
          )}
          style={{
            width: `${thumbWidth}px`,
            /* Read the right offset from --ovs-thumb-right when an ancestor
               sets it (e.g. Sidebar pushes the thumb away from SidebarRail),
               otherwise fall back to the prop. Lets the same primitive sit
               flush in a card AND clear a rail without per-call config. */
            right: `var(--ovs-thumb-right, ${thumbOffset}px)`,
            height: `${thumbHeight}px`,
            transform: `translateY(${thumbTop}px)`,
          }}
          onPointerDown={onThumbPointerDown}
        />
      </div>
    )
  },
)
OverlayScroll.displayName = 'OverlayScroll'

export { OverlayScroll }

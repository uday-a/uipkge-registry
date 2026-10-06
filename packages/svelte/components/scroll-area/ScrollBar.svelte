<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface ScrollBarProps extends HTMLAttributes<HTMLDivElement> {
    orientation?: 'vertical' | 'horizontal'
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let {
    class: className,
    orientation = 'vertical',
    ref = $bindable(null),
    ...restProps
  }: ScrollBarProps = $props()

  const vertical = $derived(orientation === 'vertical')

  let trackEl: HTMLDivElement | null = $state(null)
  let thumbEl: HTMLDivElement | null = $state(null)
  let metrics = $state({ thumbSize: 0, thumbOffset: 0, scrollable: false })

  function findViewport(): HTMLElement | null {
    const root = trackEl?.closest('[data-slot="scroll-area"]')
    return (root?.querySelector('[data-slot="scroll-area-viewport"]') as HTMLElement | null) ?? null
  }

  function update(viewport: HTMLElement) {
    const client = vertical ? viewport.clientHeight : viewport.clientWidth
    const total = vertical ? viewport.scrollHeight : viewport.scrollWidth
    const pos = vertical ? viewport.scrollTop : viewport.scrollLeft
    const track = vertical ? trackEl?.clientHeight ?? 0 : trackEl?.clientWidth ?? 0
    if (total <= client || track <= 0) {
      metrics = { thumbSize: 0, thumbOffset: 0, scrollable: false }
      return
    }
    const thumbSize = Math.max(24, (client / total) * track)
    const maxOffset = track - thumbSize
    const thumbOffset = maxOffset <= 0 ? 0 : (pos / (total - client)) * maxOffset
    metrics = { thumbSize, thumbOffset, scrollable: true }
  }

  $effect(() => {
    // Track orientation so a flip re-measures with the right axis.
    void vertical
    const viewport = findViewport()
    if (!viewport || !trackEl) return
    const onScroll = () => update(viewport)
    onScroll()
    viewport.addEventListener('scroll', onScroll, { passive: true })
    const ro = new ResizeObserver(onScroll)
    ro.observe(viewport)
    if (trackEl) ro.observe(trackEl)
    return () => {
      viewport.removeEventListener('scroll', onScroll)
      ro.disconnect()
    }
  })

  function scrollToRatio(ratio: number) {
    const viewport = findViewport()
    if (!viewport) return
    const clamped = Math.min(1, Math.max(0, ratio))
    if (vertical) {
      viewport.scrollTop = clamped * (viewport.scrollHeight - viewport.clientHeight)
    } else {
      viewport.scrollLeft = clamped * (viewport.scrollWidth - viewport.clientWidth)
    }
  }

  function onTrackPointerDown(e: PointerEvent) {
    // Drags starting on the thumb are handled by onThumbPointerDown.
    if (e.target !== e.currentTarget) return
    const track = e.currentTarget as HTMLElement
    const rect = track.getBoundingClientRect()
    const ratio = vertical ? (e.clientY - rect.top) / rect.height : (e.clientX - rect.left) / rect.width
    scrollToRatio(ratio - metrics.thumbSize / (vertical ? rect.height : rect.width) / 2)
  }

  function onThumbPointerDown(e: PointerEvent) {
    e.preventDefault()
    const thumb = e.currentTarget as HTMLElement
    const track = trackEl
    const viewport = findViewport()
    if (!track || !viewport) return
    thumb.setPointerCapture(e.pointerId)
    const startPos = vertical ? e.clientY : e.clientX
    const startScroll = vertical ? viewport.scrollTop : viewport.scrollLeft
    const trackLen = vertical ? track.clientHeight : track.clientWidth
    const scrollable = (vertical ? viewport.scrollHeight : viewport.scrollWidth) - (vertical ? viewport.clientHeight : viewport.clientWidth)
    const denom = Math.max(1, trackLen - metrics.thumbSize)

    const onMove = (ev: PointerEvent) => {
      const delta = (vertical ? ev.clientY : ev.clientX) - startPos
      const next = startScroll + (delta / denom) * scrollable
      if (vertical) viewport.scrollTop = next
      else viewport.scrollLeft = next
    }
    const onUp = () => {
      thumb.removeEventListener('pointermove', onMove)
      thumb.removeEventListener('pointerup', onUp)
      thumb.removeEventListener('pointercancel', onUp)
    }
    thumb.addEventListener('pointermove', onMove)
    thumb.addEventListener('pointerup', onUp)
    thumb.addEventListener('pointercancel', onUp)
  }

  function onKeyDown(e: KeyboardEvent) {
    const viewport = findViewport()
    if (!viewport) return
    const step = (vertical ? viewport.clientHeight : viewport.clientWidth) * 0.9 || 40
    if (e.key === 'ArrowDown' || (e.key === 'ArrowRight' && !vertical)) {
      e.preventDefault()
      if (vertical) viewport.scrollTop += 40
      else viewport.scrollLeft += 40
    } else if (e.key === 'ArrowUp' || (e.key === 'ArrowLeft' && !vertical)) {
      e.preventDefault()
      if (vertical) viewport.scrollTop -= 40
      else viewport.scrollLeft -= 40
    } else if (e.key === 'PageDown') {
      e.preventDefault()
      if (vertical) viewport.scrollTop += step
      else viewport.scrollLeft += step
    } else if (e.key === 'PageUp') {
      e.preventDefault()
      if (vertical) viewport.scrollTop -= step
      else viewport.scrollLeft -= step
    } else if (e.key === 'Home') {
      e.preventDefault()
      if (vertical) viewport.scrollTop = 0
      else viewport.scrollLeft = 0
    } else if (e.key === 'End') {
      e.preventDefault()
      if (vertical) viewport.scrollTop = viewport.scrollHeight
      else viewport.scrollLeft = viewport.scrollWidth
    }
  }
</script>

{#if metrics.scrollable}
  <div
    bind:this={ref}
    data-uipkge
    data-slot="scroll-area-scrollbar"
    data-orientation={orientation}
    role="scrollbar"
    aria-orientation={orientation}
    tabindex="0"
    class={cn(
      'absolute flex touch-none p-px transition-colors outline-none select-none focus-visible:ring-2 focus-visible:ring-ring/50',
      vertical ? 'top-0 right-0 h-full w-2.5 border-l border-l-transparent' : 'bottom-0 left-0 h-2.5 w-full flex-col border-t border-t-transparent',
      className,
    )}
    onpointerdown={onTrackPointerDown}
    onkeydown={onKeyDown}
    {...restProps}
  >
    <!-- Thumb positioning host: svelte-check's a11y rules flag interactive
         handlers on a plain div, so the draggable thumb carries the button role. -->
    <div bind:this={trackEl} class="relative flex-1">
      <div
        bind:this={thumbEl}
        data-uipkge
        data-slot="scroll-area-thumb"
        role="button"
        tabindex={-1}
        aria-hidden="true"
        class="bg-border absolute rounded-full"
        style={vertical
          ? `height: ${metrics.thumbSize}px; top: ${metrics.thumbOffset}px; left: 0; right: 0;`
          : `width: ${metrics.thumbSize}px; left: ${metrics.thumbOffset}px; top: 0; bottom: 0;`}
        onpointerdown={onThumbPointerDown}
      ></div>
    </div>
  </div>
{/if}

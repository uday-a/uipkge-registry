<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface ScrollProgressProps extends HTMLAttributes<HTMLDivElement> {
    /** Bar thickness in pixels. */
    height?: number
    /** Any CSS color or gradient — applied to `background` verbatim. */
    color?: string
    /** `fixed` pins to the viewport; `absolute` fills a positioned scrollable parent. */
    position?: 'fixed' | 'absolute'
    /** Scrollable element to measure. Defaults to the window/document. */
    container?: HTMLElement | null
    /** Lerp-smooth the displayed value toward the real progress each frame. */
    smooth?: boolean
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let {
    class: className,
    height = 3,
    color = 'var(--primary)',
    position = 'fixed',
    container = null,
    smooth = true,
    ref = $bindable(null),
    ...restProps
  }: ScrollProgressProps = $props()

  let progress = $state(0)

  let display = 0
  let target = 0
  let rafId: number | null = null
  let boundTarget: EventTarget | null = null

  function clamp01(value: number): number {
    return Math.min(1, Math.max(0, value))
  }

  function prefersReducedMotion(): boolean {
    return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }

  function readProgress(el: HTMLElement | null): number {
    if (el) {
      const max = el.scrollHeight - el.clientHeight
      return max > 0 ? clamp01(el.scrollTop / max) : 0
    }
    const doc = document.documentElement
    const scrollTop = window.scrollY || doc.scrollTop || document.body.scrollTop || 0
    const max = doc.scrollHeight - doc.clientHeight
    return max > 0 ? clamp01(scrollTop / max) : 0
  }

  function stopLoop() {
    if (rafId !== null) {
      cancelAnimationFrame(rafId)
      rafId = null
    }
  }

  function tick() {
    display += (target - display) * 0.18
    progress = display
    if (Math.abs(target - display) < 0.001) {
      display = target
      progress = target
      rafId = null
      return
    }
    rafId = requestAnimationFrame(tick)
  }

  function detach() {
    if (boundTarget) boundTarget.removeEventListener('scroll', sync)
    boundTarget = null
    if (typeof window !== 'undefined') window.removeEventListener('resize', sync)
    stopLoop()
  }

  function sync() {
    target = readProgress(container)
    if (!smooth || prefersReducedMotion()) {
      stopLoop()
      display = target
      progress = target
      return
    }
    if (rafId === null) rafId = requestAnimationFrame(tick)
  }

  $effect(() => {
    if (typeof window === 'undefined') return
    // Track `container` so a swap re-binds the scroll listener.
    const el = container
    detach()
    boundTarget = el ?? window
    boundTarget.addEventListener('scroll', sync, { passive: true })
    window.addEventListener('resize', sync)
    // Sync instantly on mount / container swap so the bar never animates up from zero.
    target = readProgress(el)
    display = target
    progress = target
    return () => detach()
  })
</script>

<div
  bind:this={ref}
  data-uipkge
  data-slot="scroll-progress"
  aria-hidden="true"
  data-position={position}
  data-smooth={smooth || undefined}
  class={cn('pointer-events-none top-0 left-0 z-50 w-full origin-left', position === 'fixed' ? 'fixed' : 'absolute', className)}
  style="height: {height}px; background: {color}; transform: scaleX({progress}); will-change: transform;"
  {...restProps}
></div>

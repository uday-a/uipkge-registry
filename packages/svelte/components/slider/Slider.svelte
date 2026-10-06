<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface SliderMark {
    label: string
    style?: Record<string, string>
  }

  export type SliderValue = number | number[] | [number, number] | null | undefined

  export interface SliderProps extends HTMLAttributes<HTMLDivElement> {
    value?: SliderValue
    defaultValue?: SliderValue
    min?: number
    max?: number
    step?: number
    orientation?: 'horizontal' | 'vertical'
    /** Enable dual-thumb range selection */
    range?: boolean
    /** Vertical orientation */
    vertical?: boolean
    /** Height when vertical (px or css value) */
    height?: string | number
    /** Tick marks with labels */
    marks?: Record<number, string | SliderMark>
    /** Show tooltip on drag/focus. Boolean or formatter function */
    tooltip?: boolean | ((value: number) => string)
    /** Show dots at each step */
    dots?: boolean
    /** Reverse direction (right-to-left or bottom-to-top) */
    reverse?: boolean
    /** Highlight the track between thumbs/min (default true) */
    included?: boolean
    /** Size variant */
    size?: 'small' | 'default'
    disabled?: boolean
    onValueChange?: (value: number | number[] | [number, number]) => void
    onValueCommit?: (value: number | number[] | [number, number]) => void
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let {
    class: className,
    value = $bindable(undefined),
    defaultValue,
    min = 0,
    max = 100,
    step = 1,
    orientation: orientationProp,
    range = false,
    vertical = false,
    height,
    marks,
    tooltip = true,
    dots = false,
    reverse = false,
    included = true,
    size = 'default',
    disabled = false,
    onValueChange,
    onValueCommit,
    ref = $bindable(null),
    ...restProps
  }: SliderProps = $props()

  const orientation = $derived(vertical ? 'vertical' : (orientationProp ?? 'horizontal'))
  const isHorizontal = $derived(orientation === 'horizontal')

  // Default track matches shadcn-ish h-1.5 (aligned with Vue/React).
  const trackSize = $derived(
    size === 'small' ? (isHorizontal ? 'h-1' : 'w-1') : isHorizontal ? 'h-1.5' : 'w-1.5',
  )
  const thumbSize = $derived(size === 'small' ? 'size-3' : 'size-4')

  /* ── value normalization ── */
  function clamp(v: number) {
    return Math.min(max, Math.max(min, v))
  }

  function snap(v: number) {
    const snapped = Math.round((v - min) / step) * step + min
    // Round away float dust (0.1 + 0.2) based on step precision.
    const precision = (String(step).split('.')[1] ?? '').length
    const factor = 10 ** precision
    return clamp(Math.round(snapped * factor) / factor)
  }

  const thumbs = $derived.by(() => {
    const v = value ?? defaultValue
    const dflt = range ? [min, max] : [min]
    if (v == null) return dflt
    if (range) {
      const arr = Array.isArray(v) ? v : [v, max]
      return [clamp(arr[0] ?? min), clamp(arr[1] ?? max)]
    }
    return (Array.isArray(v) ? v : [v]).map((n) => clamp(n ?? min))
  })

  function emitUpdate(next: number[]) {
    if (range) {
      value = [next[0] ?? min, next[1] ?? max] as [number, number]
    } else if (Array.isArray(value)) {
      // backward-compat: consumer passed an array, emit an array
      value = next
    } else {
      value = next[0] ?? min
    }
    onValueChange?.(value as number | number[] | [number, number])
  }

  function emitCommit(next: number[]) {
    if (range) {
      onValueCommit?.([next[0] ?? min, next[1] ?? max] as [number, number])
    } else if (Array.isArray(value)) {
      onValueCommit?.(next)
    } else {
      onValueCommit?.(next[0] ?? min)
    }
  }

  function setThumb(i: number, raw: number) {
    const next = [...thumbs]
    const lo = i > 0 ? (next[i - 1] ?? min) : min
    const hi = i < next.length - 1 ? (next[i + 1] ?? max) : max
    next[i] = Math.min(hi, Math.max(lo, snap(raw)))
    emitUpdate(next)
    return next
  }

  /* ── pointer interaction ── */
  let rootEl: HTMLDivElement | null = $state(null)
  // Expose the root through `bind:ref` (bind:this accepts a single target).
  $effect(() => {
    ref = rootEl
  })
  let dragIndex = $state(-1)
  let focusIndex = $state(-1)
  let lastNext: number[] | null = null

  function valueFromEvent(e: PointerEvent) {
    const root = rootEl
    if (!root) return min
    const rect = root.getBoundingClientRect()
    const ratio = isHorizontal
      ? (e.clientX - rect.left) / (rect.width || 1)
      : (rect.bottom - e.clientY) / (rect.height || 1)
    const clampedRatio = Math.min(1, Math.max(0, ratio))
    return reverse ? max - clampedRatio * (max - min) : min + clampedRatio * (max - min)
  }

  function nearestThumb(v: number) {
    let best = 0
    let bestDist = Number.POSITIVE_INFINITY
    thumbs.forEach((t, i) => {
      const d = Math.abs(t - v)
      if (d < bestDist) {
        bestDist = d
        best = i
      }
    })
    return best
  }

  function onPointerDown(e: PointerEvent) {
    if (disabled || !rootEl) return
    e.preventDefault()
    rootEl.setPointerCapture(e.pointerId)
    const v = valueFromEvent(e)
    dragIndex = nearestThumb(v)
    lastNext = setThumb(dragIndex, v)
  }

  function onPointerMove(e: PointerEvent) {
    if (disabled || dragIndex < 0) return
    e.preventDefault()
    lastNext = setThumb(dragIndex, valueFromEvent(e))
  }

  function endDrag(e: PointerEvent) {
    if (dragIndex < 0) return
    dragIndex = -1
    try {
      rootEl?.releasePointerCapture(e.pointerId)
    } catch {
      /* noop — capture already released */
    }
    emitCommit(lastNext ?? thumbs)
    lastNext = null
  }

  function onThumbKeyDown(e: KeyboardEvent, i: number) {
    if (disabled) return
    const current = thumbs[i] ?? min
    let next: number | null = null
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        next = current + step
        break
      case 'ArrowLeft':
      case 'ArrowDown':
        next = current - step
        break
      case 'PageUp':
        next = current + step * 10
        break
      case 'PageDown':
        next = current - step * 10
        break
      case 'Home':
        next = min
        break
      case 'End':
        next = max
        break
    }
    if (next == null) return
    e.preventDefault()
    emitCommit(setThumb(i, next))
  }

  /* ── geometry ── */
  const pct = (v: number) => ((v - min) / (max - min || 1)) * 100
  // Display position flips under `reverse` so the fill grows from the trailing edge.
  const pos = (v: number) => (reverse ? 100 - pct(v) : pct(v))

  const rangeStyle = $derived.by(() => {
    const lo = Math.min(...thumbs)
    const hi = Math.max(...thumbs)
    if (range || thumbs.length > 1) {
      const a = Math.min(pos(lo), pos(hi))
      const b = Math.max(pos(lo), pos(hi))
      return isHorizontal ? `left:${a}%;right:${100 - b}%` : `bottom:${a}%;top:${100 - b}%`
    }
    const p = pos(thumbs[0] ?? min)
    return isHorizontal
      ? reverse
        ? `left:${p}%;right:0`
        : `left:0;width:${p}%`
      : reverse
        ? `bottom:${p}%;top:0`
        : `bottom:0;height:${p}%`
  })

  const thumbStyle = (v: number) =>
    isHorizontal ? `left:${pos(v)}%` : `bottom:${pos(v)}%`

  /* ── marks ── */
  const markList = $derived.by(() => {
    if (!marks) return []
    const entries = Object.entries(marks).map(([key, val]) => {
      const num = Number(key)
      const label = typeof val === 'string' ? val : val.label
      const style = typeof val === 'string' ? undefined : val.style
      const pctValue = ((num - min) / (max - min || 1)) * 100
      return { value: num, label, style, pct: pctValue }
    })
    entries.sort((a, b) => a.value - b.value)
    return entries
  })

  /* ── step dots ── */
  const dotList = $derived.by(() => {
    if (!dots) return [] as number[]
    const list: number[] = []
    const count = Math.floor((max - min) / step)
    for (let i = 0; i <= count; i++) {
      list.push(min + i * step)
    }
    return list
  })

  /* ── tooltip ── */
  const showTooltip = $derived(tooltip !== false)

  function formatTooltip(v: number) {
    if (typeof tooltip === 'function') return tooltip(v)
    return String(v)
  }

  const wrapperStyle = $derived(
    !isHorizontal && height ? `height:${typeof height === 'number' ? `${height}px` : height}` : undefined,
  )
</script>

<div class={cn('relative w-full', !isHorizontal && 'flex flex-col items-center')} style={wrapperStyle}>
  <div
    bind:this={rootEl}
    data-uipkge=""
    data-slot="slider"
    data-orientation={orientation}
    data-disabled={disabled ? '' : undefined}
    class={cn(
      'relative flex touch-none select-none data-[disabled]:opacity-50',
      isHorizontal ? 'w-full items-center' : 'h-full min-h-44 flex-col justify-center',
      className,
    )}
    onpointerdown={onPointerDown}
    onpointermove={onPointerMove}
    onpointerup={endDrag}
    onpointercancel={endDrag}
    {...restProps}
  >
    <!-- Track -->
    <div
      data-uipkge=""
      data-slot="slider-track"
      class={cn('bg-muted relative grow overflow-hidden rounded-full', trackSize)}
    >
      {#if included}
        <div
          data-uipkge=""
          data-slot="slider-range"
          class={cn('bg-primary absolute', isHorizontal ? 'h-full' : 'w-full')}
          style={rangeStyle}
        ></div>
      {/if}
    </div>

    <!-- Step dots -->
    {#each dotList as dot (dot)}
      <div
        class={cn(
          'border-primary/40 bg-background absolute rounded-full border',
          isHorizontal ? 'top-1/2 size-1.5 -translate-y-1/2' : 'left-1/2 size-1.5 -translate-x-1/2',
          size === 'small' && 'size-1',
        )}
        style={isHorizontal
          ? `left:${((dot - min) / (max - min || 1)) * 100}%;transform:translateX(-50%) translateY(-50%)`
          : `bottom:${((dot - min) / (max - min || 1)) * 100}%;transform:translateX(-50%) translateY(50%)`}
      ></div>
    {/each}

    <!-- Marks -->
    {#if markList.length}
      <div
        class={cn(
          'pointer-events-none absolute',
          isHorizontal ? 'top-full mt-2.5 h-5 w-full' : 'top-0 left-full ml-3 h-full w-20',
        )}
      >
        {#each markList as mark (mark.value)}
          {@const markStyle = Object.entries(mark.style ?? {})
            .map(([k, v]) => `${k}:${v}`)
            .join(';')}
          <span
            class="text-muted-foreground absolute text-xs whitespace-nowrap"
            style="{markStyle}{markStyle ? ';' : ''}{isHorizontal
              ? `left:${mark.pct}%;transform:translateX(-50%)`
              : `bottom:${mark.pct}%;transform:translateY(50%)`}"
          >
            {mark.label}
          </span>
        {/each}
      </div>
    {/if}

    <!-- Thumbs (with tooltips) -->
    {#each thumbs as thumbValue, idx (idx)}
      <span
        class={cn(
          'group/slider-thumb absolute flex items-center justify-center',
          isHorizontal ? 'top-1/2 -translate-x-1/2 -translate-y-1/2' : 'left-1/2 -translate-x-1/2 translate-y-1/2',
        )}
        style={thumbStyle(thumbValue)}
      >
        <div
          role="slider"
          tabindex={disabled ? -1 : 0}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={thumbValue}
          aria-orientation={orientation}
          aria-disabled={disabled || undefined}
          data-uipkge=""
          data-slot="slider-thumb"
          data-disabled={disabled ? '' : undefined}
          class={cn(
            'border-primary bg-background ring-ring/50 block shrink-0 touch-manipulation rounded-full border shadow-sm hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50 data-[disabled]:pointer-events-none',
            thumbSize,
          )}
          onkeydown={(e) => onThumbKeyDown(e, idx)}
          onfocus={() => (focusIndex = idx)}
          onblur={() => (focusIndex = -1)}
        ></div>
        {#if showTooltip}
          <span
            class={cn(
              'bg-foreground text-background pointer-events-none absolute z-50 w-fit rounded-md px-2 py-1 text-xs whitespace-nowrap opacity-0 transition-opacity group-hover/slider-thumb:opacity-100 group-focus-visible/slider-thumb:opacity-100',
              isHorizontal ? 'bottom-full left-1/2 mb-2 -translate-x-1/2' : 'top-1/2 left-full ml-2 -translate-y-1/2',
              (dragIndex === idx || focusIndex === idx) && 'opacity-100',
            )}
          >
            {formatTooltip(thumbValue)}
          </span>
        {/if}
      </span>
    {/each}
  </div>
</div>

<style>
  /*
    Subtle motion suite for slider:
    - Range fill + thumb position ease on keyboard / programmatic steps
    - Press scale on thumb (CSS `scale`, not `transform` — primitives set transform inline)
    - While the root is :active (pointer drag / track scrub), drop positional transitions so the
      thumb and fill track the pointer 1:1 with no lag
    - prefers-reduced-motion kills all of it
  */
  @media (prefers-reduced-motion: no-preference) {
    [data-slot='slider-range'] {
      transition-property: left, right, top, bottom;
      transition-duration: 150ms;
      transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
    }

    [data-slot='slider-thumb'] {
      scale: 1;
      transition-property: color, box-shadow, border-color, scale, left, right, top, bottom;
      transition-duration: 150ms;
      transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
    }

    [data-slot='slider-thumb']:active:not([data-disabled]) {
      scale: 0.94;
      transition-duration: 100ms;
    }

    /* Instant follow while pointer is down — keyboard still gets the ease above */
    [data-slot='slider']:active [data-slot='slider-range'],
    [data-slot='slider']:active [data-slot='slider-thumb'] {
      transition-property: color, box-shadow, border-color, scale;
      transition-duration: 100ms;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    [data-slot='slider-range'],
    [data-slot='slider-thumb'] {
      transition: none !important;
      scale: 1 !important;
    }
  }
</style>

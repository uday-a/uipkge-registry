<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { SVGAttributes } from 'svelte/elements'

  export interface KnobProps extends Omit<SVGAttributes<SVGSVGElement>, 'onchange'> {
    /** Two-way bound value (`bind:value`). Clamped to [min, max] and snapped to `step`. */
    value?: number
    min?: number
    max?: number
    step?: number
    size?: number
    strokeWidth?: number
    valueColor?: string
    rangeColor?: string
    disabled?: boolean
    readonly?: boolean
    showValue?: boolean
    /** Accessible name for the slider. Prefer over a visible label when none is nearby. */
    ariaLabel?: string
    /** Custom centered value content (must be SVG-safe, e.g. `<tspan>` or text). */
    valueSnippet?: Snippet<[{ value: number }]>
    /** Fires with the new value whenever it changes. */
    onchange?: (value: number) => void
    ref?: SVGSVGElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let {
    class: className,
    value = $bindable(0),
    min = 0,
    max = 100,
    step = 1,
    size = 100,
    strokeWidth = 14,
    valueColor = 'var(--primary)',
    rangeColor = 'var(--muted)',
    disabled = false,
    readonly = false,
    showValue = true,
    ariaLabel,
    valueSnippet,
    onchange,
    ref = $bindable(null),
    ...restProps
  }: KnobProps = $props()

  let isDragging = $state(false)

  const clamped = $derived(clamp(value, min, max))
  const percent = $derived(max === min ? 0 : (clamped - min) / (max - min))

  const startAngle = -Math.PI * 0.75
  const endAngle = Math.PI * 0.75
  const sweep = endAngle - startAngle

  const rangePath = $derived(arcPath(50, 50, 40, startAngle, endAngle))
  const valuePath = $derived(arcPath(50, 50, 40, startAngle, startAngle + sweep * percent))

  function arcPath(cx: number, cy: number, r: number, a1: number, a2: number) {
    const x1 = cx + r * Math.cos(a1)
    const y1 = cy + r * Math.sin(a1)
    const x2 = cx + r * Math.cos(a2)
    const y2 = cy + r * Math.sin(a2)
    const large = a2 - a1 > Math.PI ? 1 : 0
    return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`
  }

  function clamp(v: number, lo: number, hi: number) {
    return Math.min(hi, Math.max(lo, v))
  }

  function snap(v: number) {
    const stepped = Math.round((v - min) / step) * step + min
    return clamp(stepped, min, max)
  }

  function setValue(v: number) {
    if (disabled || readonly) return
    const next = snap(v)
    if (next === value) return
    value = next
    onchange?.(next)
  }

  function angleFromEvent(e: PointerEvent): number {
    const rect = ref!.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    return Math.atan2(e.clientY - cy, e.clientX - cx)
  }

  function angleToValue(angle: number): number {
    let a = angle - startAngle
    if (a < 0) a += Math.PI * 2
    if (a > sweep) {
      return a < (Math.PI * 2 + sweep) / 2 ? max : min
    }
    return min + (a / sweep) * (max - min)
  }

  function onPointerDown(e: PointerEvent & { currentTarget: SVGSVGElement }) {
    if (disabled || readonly) return
    e.currentTarget.setPointerCapture(e.pointerId)
    isDragging = true
    setValue(angleToValue(angleFromEvent(e)))
  }

  function onPointerMove(e: PointerEvent) {
    if (!isDragging) return
    setValue(angleToValue(angleFromEvent(e)))
  }

  function onPointerUp(e: PointerEvent & { currentTarget: SVGSVGElement }) {
    if (!isDragging) return
    isDragging = false
    try {
      e.currentTarget.releasePointerCapture(e.pointerId)
    } catch {
      // pointer already released
    }
  }

  function onKeyDown(e: KeyboardEvent) {
    if (disabled || readonly) return
    const big = step * 10
    switch (e.key) {
      case 'ArrowUp':
      case 'ArrowRight':
        e.preventDefault()
        setValue(clamped + step)
        break
      case 'ArrowDown':
      case 'ArrowLeft':
        e.preventDefault()
        setValue(clamped - step)
        break
      case 'PageUp':
        e.preventDefault()
        setValue(clamped + big)
        break
      case 'PageDown':
        e.preventDefault()
        setValue(clamped - big)
        break
      case 'Home':
        e.preventDefault()
        setValue(min)
        break
      case 'End':
        e.preventDefault()
        setValue(max)
        break
    }
  }

  // Non-passive wheel listener so preventDefault actually blocks page scroll.
  $effect(() => {
    const node = ref
    if (!node) return
    const wheelHandler = (e: WheelEvent) => {
      if (disabled || readonly) return
      e.preventDefault()
      setValue(clamped + (e.deltaY < 0 ? step : -step))
    }
    node.addEventListener('wheel', wheelHandler, { passive: false })
    return () => {
      node.removeEventListener('wheel', wheelHandler)
    }
  })
</script>

<svg
  bind:this={ref}
  data-uipkge=""
  data-slot="knob"
  class={cn(
    'focus-visible:ring-ring inline-block touch-none rounded-full outline-none select-none focus-visible:ring-2',
    disabled && 'cursor-not-allowed opacity-50',
    !disabled && !readonly && 'cursor-pointer',
    className,
  )}
  width={size}
  height={size}
  viewBox="0 0 100 100"
  role="slider"
  aria-label={ariaLabel ?? 'Value'}
  aria-valuemin={min}
  aria-valuemax={max}
  aria-valuenow={clamped}
  aria-disabled={disabled || undefined}
  aria-readonly={readonly || undefined}
  tabindex={disabled ? -1 : 0}
  onpointerdown={onPointerDown}
  onpointermove={onPointerMove}
  onpointerup={onPointerUp}
  onpointercancel={onPointerUp}
  onkeydown={onKeyDown}
  {...restProps}
>
  <path d={rangePath} stroke={rangeColor} stroke-width={strokeWidth} fill="none" stroke-linecap="round" />
  <path d={valuePath} stroke={valueColor} stroke-width={strokeWidth} fill="none" stroke-linecap="round" />
  {#if showValue}
    <text x="50" y="55" text-anchor="middle" font-size="18" class="fill-foreground font-medium">
      {#if valueSnippet}
        {@render valueSnippet({ value: clamped })}
      {:else}
        {clamped}
      {/if}
    </text>
  {/if}
</svg>

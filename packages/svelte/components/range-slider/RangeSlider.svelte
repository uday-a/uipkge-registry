<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface RangeSliderProps extends HTMLAttributes<HTMLDivElement> {
    /** The controlled value. Bindable `[min, max]` tuple. */
    value?: [number, number]
    /** Initial value for uncontrolled use. */
    defaultValue?: [number, number]
    /** Called with the new tuple after every commit. */
    onValueChange?: (value: [number, number]) => void
    /** When `true`, prevents the user from interacting with the range slider */
    disabled?: boolean
    /** Minimum value */
    min?: number
    /** Maximum value */
    max?: number
    /** Step value */
    step?: number
    /** Label for the range slider */
    label?: string
    /** Hint text for the range slider */
    hint?: string
    /** Error messages to display */
    errorMessages?: string | string[]
    /** Whether to show error state */
    error?: boolean
    /** Custom color for the track fill */
    color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | string
    /** Thumb size */
    thumbSize?: 'sm' | 'md' | 'lg'
    /** Track height */
    trackHeight?: 'sm' | 'md' | 'lg'
    /** Show ticks */
    showTicks?: boolean
    /** Tick interval */
    tickInterval?: number
    /** Show thumb labels */
    thumbLabel?: boolean
    /** Invert the slider */
    inverted?: boolean
    /** Format thumb label */
    thumbLabelFormat?: (value: number) => string
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let {
    class: className,
    value = $bindable(),
    defaultValue = undefined,
    onValueChange,
    disabled = false,
    min = 0,
    max = 100,
    step = 1,
    label = undefined,
    hint = undefined,
    errorMessages = undefined,
    error = false,
    color = 'primary',
    thumbSize = 'md',
    trackHeight = 'md',
    showTicks = false,
    tickInterval = undefined,
    thumbLabel = false,
    inverted = false,
    thumbLabelFormat = undefined,
    ref = $bindable(null),
    ...restProps
  }: RangeSliderProps = $props()

  const fieldId = $props.id()

  let track: HTMLDivElement | null = null
  // Uncontrolled seed: intentionally the initial `defaultValue` (or full span) only.
  // svelte-ignore state_referenced_locally
  let internal = $state<[number, number]>(defaultValue ?? [min, max])
  let dragging = $state<0 | 1 | null>(null)

  const current = $derived(value ?? internal)

  function clampTuple([lo, hi]: [number, number]): [number, number] {
    const quantize = (v: number) => {
      if (!Number.isFinite(step) || step <= 0) return Math.min(Math.max(v, min), max)
      const snapped = min + Math.round((v - min) / step) * step
      // Round away float artifacts from fractional steps (0.1 + 0.2 != 0.3).
      const precision = Math.max(0, -Math.floor(Math.log10(step)))
      return Math.min(Math.max(Number(snapped.toFixed(precision)), min), max)
    }
    const q0 = quantize(lo)
    const q1 = quantize(hi)
    return q0 <= q1 ? [q0, q1] : [q1, q0]
  }

  function commit(next: [number, number]) {
    const clamped = clampTuple(next)
    internal = clamped
    value = clamped
    onValueChange?.(clamped)
  }

  /** Raw 0..100 position of a value along the track (pre-inversion). */
  function percentOf(v: number): number {
    if (max === min) return 0
    return ((v - min) / (max - min)) * 100
  }

  /** Visual left% for a value, honoring `inverted`. */
  function visualPercent(v: number): number {
    const p = percentOf(v)
    return inverted ? 100 - p : p
  }

  const rangeStyle = $derived.by(() => {
    const a = visualPercent(current[0])
    const b = visualPercent(current[1])
    const left = Math.min(a, b)
    return `left: ${left}%; width: ${Math.abs(b - a)}%`
  })

  function valueFromClientX(clientX: number): number {
    const rect = track?.getBoundingClientRect()
    if (!rect || rect.width === 0) return min
    const ratio = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1)
    return min + (inverted ? 1 - ratio : ratio) * (max - min)
  }

  function onTrackPointerDown(event: PointerEvent) {
    if (disabled) return
    // Jump the nearest thumb to the click, then drag it.
    const v = valueFromClientX(event.clientX)
    const dist0 = Math.abs(v - current[0])
    const dist1 = Math.abs(v - current[1])
    const index: 0 | 1 = dist0 <= dist1 ? 0 : 1
    event.preventDefault()
    ;(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId)
    dragging = index
    const next: [number, number] = index === 0 ? [v, current[1]] : [current[0], v]
    commit(next)
  }

  function onThumbPointerDown(event: PointerEvent, index: 0 | 1) {
    if (disabled) return
    event.preventDefault()
    event.stopPropagation()
    ;(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId)
    dragging = index
  }

  function onPointerMove(event: PointerEvent) {
    if (dragging === null || disabled) return
    const v = valueFromClientX(event.clientX)
    const next: [number, number] =
      dragging === 0 ? [Math.min(v, current[1]), current[1]] : [current[0], Math.max(v, current[0])]
    commit(next)
  }

  function onPointerUp() {
    dragging = null
  }

  function onThumbKeydown(event: KeyboardEvent, index: 0 | 1) {
    if (disabled) return
    const page = step * 10
    let v: number | null = null
    if (event.key === 'ArrowRight' || event.key === 'ArrowUp') v = current[index] + step
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') v = current[index] - step
    else if (event.key === 'PageUp') v = current[index] + page
    else if (event.key === 'PageDown') v = current[index] - page
    else if (event.key === 'Home') v = index === 0 ? min : current[0]
    else if (event.key === 'End') v = index === 1 ? max : current[1]
    else return
    event.preventDefault()
    const next: [number, number] =
      index === 0 ? [Math.min(v, current[1]), current[1]] : [current[0], Math.max(v, current[0])]
    commit(next)
  }

  // Color classes
  const colorClasses: Record<string, string> = {
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    success: 'bg-success',
    warning: 'bg-warning',
    error: 'bg-destructive',
    info: 'bg-info',
  }

  // Track height classes
  const trackHeightClasses = {
    sm: 'h-1',
    md: 'h-1.5',
    lg: 'h-2',
  }

  // Thumb size classes
  const thumbSizeClasses = {
    sm: 'size-3',
    md: 'size-4',
    lg: 'size-5',
  }

  // Generate ticks
  const ticks = $derived.by(() => {
    if (!showTicks || !tickInterval) return []
    const result: number[] = []
    for (let i = min; i <= max; i += tickInterval) {
      result.push(i)
    }
    return result
  })

  const hasError = $derived.by(() => {
    if (error) return true
    if (errorMessages && (typeof errorMessages === 'string' ? errorMessages : errorMessages.length > 0)) return true
    return false
  })

  const describedBy = $derived(
    hint && !hasError ? `${fieldId}-hint` : hasError ? `${fieldId}-error` : undefined,
  )
</script>

<div bind:this={ref} data-uipkge="" data-slot="range-slider" class={cn('flex flex-col gap-2', className)} {...restProps}>
  {#if label}
    <span id={fieldId} class="text-sm font-medium">
      {label}
    </span>
  {/if}

  {#if hint && !hasError}
    <p id="{fieldId}-hint" class="text-muted-foreground text-xs">
      {hint}
    </p>
  {/if}

  <div class="flex items-center gap-4">
    <!-- Min value display -->
    <div class="text-muted-foreground min-w-[3rem] text-sm tabular-nums" aria-hidden="true">
      {current[0]}
    </div>

    <!-- svelte-ignore a11y_no_noninteractive_element_interactions: hand-rolled slider track; thumbs own keyboard + ARIA -->
    <!-- svelte-ignore a11y_role_supports_aria_props: aria-invalid mirrors the Vue twin's error state -->
    <div
      bind:this={track}
      role="group"
      aria-labelledby={label ? fieldId : undefined}
      aria-describedby={describedBy}
      aria-invalid={hasError || undefined}
      aria-disabled={disabled || undefined}
      data-orientation="horizontal"
      data-disabled={disabled || undefined}
      class="relative flex w-full touch-none items-center select-none"
      onpointerdown={onTrackPointerDown}
      onpointermove={onPointerMove}
      onpointerup={onPointerUp}
      onpointercancel={onPointerUp}
    >
      <div
        data-uipkge=""
        data-slot="slider-track"
        class={cn('bg-muted relative w-full overflow-hidden rounded-full', trackHeightClasses[trackHeight])}
      >
        <div
          data-uipkge=""
          data-slot="slider-range"
          style={rangeStyle}
          class={cn('absolute h-full', colorClasses[color] || colorClasses.primary)}
        ></div>
      </div>

      <!-- Ticks -->
      {#if showTicks && ticks.length > 0}
        <div
          class="pointer-events-none absolute top-1/2 right-0 left-0 flex -translate-y-1/2 justify-between"
          aria-hidden="true"
        >
          {#each ticks as tick (tick)}
            <div class="bg-muted-foreground/30 h-2 w-0.5 rounded-full"></div>
          {/each}
        </div>
      {/if}

      <!-- Start Thumb (Min) -->
      <!-- svelte-ignore a11y_no_noninteractive_tabindex: role="slider" is the interactive thumb -->
      <div
        role="slider"
        tabindex={disabled ? -1 : 0}
        data-uipkge=""
        data-slot="slider-thumb"
        aria-label={label ? `${label} minimum` : 'Minimum value'}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={current[0]}
        aria-valuetext={thumbLabelFormat ? thumbLabelFormat(current[0]) : String(current[0])}
        aria-disabled={disabled || undefined}
        style="left: {visualPercent(current[0])}%; translate: -50% 0;"
        class={cn(
          'border-primary ring-ring/50 bg-background absolute block rounded-full border shadow-sm transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50',
          thumbSizeClasses[thumbSize],
          disabled && 'pointer-events-none opacity-50',
          hasError && 'border-destructive',
        )}
        onpointerdown={(e) => onThumbPointerDown(e, 0)}
        onkeydown={(e) => onThumbKeydown(e, 0)}
      >
        {#if thumbLabel}
          <span
            class="bg-background absolute -top-6 left-1/2 -translate-x-1/2 rounded px-1 text-xs whitespace-nowrap"
          >
            {thumbLabelFormat ? thumbLabelFormat(current[0]) : current[0]}
          </span>
        {/if}
      </div>

      <!-- End Thumb (Max) -->
      <!-- svelte-ignore a11y_no_noninteractive_tabindex: role="slider" is the interactive thumb -->
      <div
        role="slider"
        tabindex={disabled ? -1 : 0}
        data-uipkge=""
        data-slot="slider-thumb"
        aria-label={label ? `${label} maximum` : 'Maximum value'}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={current[1]}
        aria-valuetext={thumbLabelFormat ? thumbLabelFormat(current[1]) : String(current[1])}
        aria-disabled={disabled || undefined}
        style="left: {visualPercent(current[1])}%; translate: -50% 0;"
        class={cn(
          'border-primary ring-ring/50 bg-background absolute block rounded-full border shadow-sm transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50',
          thumbSizeClasses[thumbSize],
          disabled && 'pointer-events-none opacity-50',
          hasError && 'border-destructive',
        )}
        onpointerdown={(e) => onThumbPointerDown(e, 1)}
        onkeydown={(e) => onThumbKeydown(e, 1)}
      >
        {#if thumbLabel}
          <span
            class="bg-background absolute -top-6 left-1/2 -translate-x-1/2 rounded px-1 text-xs whitespace-nowrap"
          >
            {thumbLabelFormat ? thumbLabelFormat(current[1]) : current[1]}
          </span>
        {/if}
      </div>
    </div>

    <!-- Max value display -->
    <div class="text-muted-foreground min-w-[3rem] text-sm tabular-nums" aria-hidden="true">
      {current[1]}
    </div>
  </div>

  <!-- Tick labels -->
  {#if showTicks && ticks.length > 0}
    <div class="text-muted-foreground flex justify-between px-1 text-xs">
      <span>{min}</span>
      <span>{max}</span>
    </div>
  {/if}

  {#if hasError}
    <div id="{fieldId}-error" class="flex flex-col gap-0.5" role="alert">
      {#if typeof errorMessages === 'string'}
        <p class="text-destructive text-xs">
          {errorMessages}
        </p>
      {:else}
        {#each errorMessages ?? [] as msg, i (i)}
          <p class="text-destructive text-xs">
            {msg}
          </p>
        {/each}
      {/if}
    </div>
  {/if}
</div>

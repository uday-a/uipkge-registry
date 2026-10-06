<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  export interface CircularProgressProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
    /** Progress value 0-100. Ignored when indeterminate is true. */
    value?: number
    /** Diameter in pixels. */
    size?: 'sm' | 'default' | 'lg' | number
    /** Stroke thickness in pixels. */
    thickness?: number
    /** Progress arc color. Defaults to primary. */
    color?: string
    /** Track (background ring) color. */
    trackColor?: string
    /** Indeterminate spinning mode. */
    indeterminate?: boolean
    /** Show the numeric value in the center. */
    showValue?: boolean
    /** Suffix appended to the value (e.g. '%'). */
    suffix?: string
    /** Accessible label. */
    ariaLabel?: string
    /** Center content. Receives `{ value }` (normalized 0-100). */
    children?: Snippet<[{ value: number }]>
  }
</script>

<script lang="ts">
  import { onDestroy } from 'svelte'
  import { cn } from '$lib/utils'
  import { circularProgressVariants } from './circular-progress.variants'

  let {
    class: className,
    value = 0,
    size = 'default',
    thickness = 8,
    color,
    trackColor,
    indeterminate = false,
    showValue = false,
    suffix = '%',
    ariaLabel = 'Progress',
    children,
    ...restProps
  }: CircularProgressProps = $props()

  const sizePx = $derived.by(() => {
    if (typeof size === 'number') return size
    switch (size) {
      case 'sm':
        return 40
      case 'lg':
        return 80
      default:
        return 56
    }
  })

  const normalizedValue = $derived(Math.min(100, Math.max(0, value)))
  const isComplete = $derived(!indeterminate && normalizedValue >= 100)

  /** One-shot pulse only when value crosses into complete — not on static 100 mounts. */
  let pulseComplete = $state(false)
  let pulseTimer: ReturnType<typeof setTimeout> | undefined
  let prevValue: number | undefined = undefined

  $effect(() => {
    const current = normalizedValue
    const ind = indeterminate
    if (ind || current < 100) {
      pulseComplete = false
      clearTimeout(pulseTimer)
      prevValue = current
      return
    }
    if (prevValue === undefined) {
      prevValue = current
      return
    }
    if (current >= 100 && prevValue < 100) {
      pulseComplete = false
      // Retrigger CSS animation if complete→incomplete→complete in quick succession.
      requestAnimationFrame(() => {
        pulseComplete = true
        clearTimeout(pulseTimer)
        pulseTimer = setTimeout(() => {
          pulseComplete = false
        }, 600)
      })
    }
    prevValue = current
  })

  onDestroy(() => {
    clearTimeout(pulseTimer)
  })

  const radius = $derived((sizePx - thickness) / 2)
  const circumference = $derived(2 * Math.PI * radius)
  const strokeDashoffset = $derived(indeterminate ? circumference * 0.25 : circumference * (1 - normalizedValue / 100))

  const resolvedColor = $derived(color || 'var(--primary)')
  const resolvedTrackColor = $derived(trackColor || 'var(--muted)')

  const viewBox = $derived(`0 0 ${sizePx} ${sizePx}`)
  const center = $derived(sizePx / 2)

  const fontSize = $derived.by(() => {
    const s = sizePx
    if (s <= 40) return 'text-xs'
    if (s <= 56) return 'text-sm'
    return 'text-base'
  })
</script>

<div
  data-uipkge
  data-slot="circular-progress"
  data-size={typeof size === 'string' ? size : 'custom'}
  data-indeterminate={indeterminate ? 'true' : 'false'}
  data-complete={isComplete ? 'true' : 'false'}
  class={cn(circularProgressVariants(), className)}
  style="width: {sizePx}px; height: {sizePx}px;"
  role="progressbar"
  aria-valuemin={0}
  aria-valuemax={100}
  aria-valuenow={indeterminate ? undefined : normalizedValue}
  aria-busy={indeterminate ? 'true' : undefined}
  aria-label={ariaLabel}
  {...restProps}
>
  <svg width={sizePx} height={sizePx} {viewBox} class="block">
    <!-- Track -->
    <circle cx={center} cy={center} r={radius} fill="none" stroke={resolvedTrackColor} stroke-width={thickness} />
    <!-- Progress arc -->
    <g
      transform={indeterminate ? undefined : `rotate(-90 ${center} ${center})`}
      class={indeterminate ? 'animate-spin-circular' : ''}
      style={indeterminate ? 'transform-box: fill-box; transform-origin: center;' : undefined}
    >
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke={resolvedColor}
        stroke-width={thickness}
        stroke-linecap="round"
        stroke-dasharray={circumference}
        stroke-dashoffset={strokeDashoffset}
        class={cn(
          !indeterminate && 'transition-[stroke-dashoffset] duration-500 ease-out motion-reduce:transition-none',
          pulseComplete && 'animate-circular-complete',
        )}
      />
    </g>
  </svg>

  {#if showValue || children}
    <div class="absolute inset-0 flex items-center justify-center">
      {#if children}
        {@render children({ value: normalizedValue })}
      {:else if showValue}
        <span class={cn('text-foreground font-medium tabular-nums', fontSize)}>
          {Math.round(normalizedValue)}{suffix}
        </span>
      {/if}
    </div>
  {/if}
</div>

<style>
  @media (prefers-reduced-motion: no-preference) {
    .animate-spin-circular {
      animation: spin-circular 1.4s linear infinite;
    }

    /* Soft acknowledge when the arc lands on 100 — one shot per enter. */
    .animate-circular-complete {
      animation: circular-progress-complete 0.55s ease-out 1;
    }
  }

  @keyframes spin-circular {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes circular-progress-complete {
    0%,
    100% {
      opacity: 1;
    }
    45% {
      opacity: 0.72;
    }
  }
</style>

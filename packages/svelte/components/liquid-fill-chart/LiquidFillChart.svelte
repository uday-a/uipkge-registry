<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface LiquidFillChartProps extends HTMLAttributes<HTMLDivElement> {
    /** Fill 0..100. */
    value: number
    /** Container height. Default 220. */
    height?: number | string
    /** Wave colour. Defaults to chart-1 token. */
    color?: string
    /** Show the % label in the centre. Default true. */
    showLabel?: boolean
    unit?: string
    /** Accessible name announced for the chart image. Defaults to "Chart". */
    ariaLabel?: string
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let {
    value,
    height = 220,
    color = 'var(--chart-1)',
    showLabel = true,
    unit = '%',
    ariaLabel,
    class: className,
    ref = $bindable(null),
    ...restProps
  }: LiquidFillChartProps = $props()

  const pct = $derived(Math.max(0, Math.min(100, value)))
  const heightStyle = $derived(/^\d+$/.test(String(height)) ? `${height}px` : String(height))
  // Wave offset: waterline rises as pct grows. Two phase-shifted paths give depth.
  const level = $derived(100 - pct * 0.72)
  const uid = `lf-${Math.random().toString(36).slice(2, 8)}`
</script>

<!-- Focusable chart image mirrors the Vue twin for keyboard users. -->
<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div
  bind:this={ref}
  data-uipkge=""
  data-slot="liquid-fill-chart"
  role="img"
  tabindex="0"
  aria-label={ariaLabel || `Liquid fill chart at ${Math.round(pct)}${unit}`}
  style:height={heightStyle}
  class={cn(
    'focus-visible:ring-ring flex w-full items-center justify-center focus-visible:ring-2 focus-visible:outline-none',
    className,
  )}
  {...restProps}
>
  <svg viewBox="0 0 200 200" class="aspect-square h-full max-h-full" role="presentation">
    <defs>
      <clipPath id={uid}>
        <circle cx="100" cy="100" r="84" />
      </clipPath>
    </defs>
    <circle cx="100" cy="100" r="88" fill="none" stroke="currentColor" stroke-width="3" class="text-border" />
    <g clip-path={`url(#${uid})`}>
      <rect x="0" y="0" width="200" height="200" class="fill-muted/40" />
      <path
        d={`M 0 ${level} Q 25 ${level - 10}, 50 ${level} T 100 ${level} T 150 ${level} T 200 ${level} V 200 H 0 Z`}
        fill={color}
        opacity="0.55"
      >
        <animateTransform
          attributeName="transform"
          type="translate"
          from="0 0"
          to="-100 0"
          dur="6s"
          repeatCount="indefinite"
        />
      </path>
      <path
        d={`M 0 ${level + 6} Q 25 ${level - 4}, 50 ${level + 6} T 100 ${level + 6} T 150 ${level + 6} T 200 ${level + 6} V 200 H 0 Z`}
        fill={color}
        opacity="0.85"
      >
        <animateTransform
          attributeName="transform"
          type="translate"
          from="-100 0"
          to="0 0"
          dur="4s"
          repeatCount="indefinite"
        />
      </path>
    </g>
    {#if showLabel}
      <text
        x="100"
        y="104"
        text-anchor="middle"
        dominant-baseline="middle"
        class="fill-foreground"
        font-size="30"
        font-weight="700"
      >
        {Math.round(pct)}{unit}
      </text>
    {/if}
  </svg>
</div>

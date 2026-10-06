<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface ProgressRing {
    /** 0..100. */
    value: number
    /** Defaults to chart-1..N tokens. */
    color?: string
    label?: string
  }

  export interface ProgressRingChartProps extends HTMLAttributes<HTMLDivElement> {
    rings: ProgressRing[]
    height?: number | string
    /** Ring thickness in SVG units. Default 14. */
    stroke?: number
    /** Show the centre label (first ring value or custom). Default true. */
    showLabel?: boolean
    /** Centre label override. */
    centerLabel?: string
    colors?: string[]
    /** Accessible name announced for the chart image. Defaults to "Chart". */
    ariaLabel?: string
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let {
    class: className,
    rings,
    height = 220,
    stroke = 14,
    showLabel = true,
    centerLabel,
    colors = ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)', 'var(--chart-5)'],
    ariaLabel,
    ref = $bindable(null),
    ...restProps
  }: ProgressRingChartProps = $props()

  const heightStyle = $derived(/^\d+$/.test(String(height)) ? `${height}px` : String(height))
  const C = 2 * Math.PI * 80
  const arcs = $derived(
    rings.map((r, i) => {
      const pct = Math.max(0, Math.min(100, r.value)) / 100
      return {
        dash: `${(pct * C).toFixed(1)} ${C.toFixed(1)}`,
        color: r.color ?? colors[i % colors.length],
        r: 80 - i * (stroke + 6),
        label: r.label,
        value: r.value,
      }
    }),
  )
  const view = $derived(200 + (rings.length - 1) * (stroke + 6) * 2)
  const center = $derived(view / 2)
  const summary = $derived(
    centerLabel ?? (rings.length === 1 ? `${Math.round(rings[0]?.value ?? 0)}%` : `${rings.length} rings`),
  )
  const label = $derived(
    ariaLabel || `Progress ring chart: ${rings.map((r) => `${r.label ?? 'value'} ${Math.round(r.value)}%`).join(', ')}`,
  )
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex: chart is deliberately focusable so keyboard users reach the labelled image -->
<div
  {...restProps}
  bind:this={ref}
  data-uipkge=""
  data-slot="progress-ring-chart"
  role="img"
  tabindex="0"
  aria-label={label}
  style:height={heightStyle}
  class={cn(
    'focus-visible:ring-ring flex w-full items-center justify-center focus-visible:ring-2 focus-visible:outline-none',
    className,
  )}
>
  <svg viewBox={`0 0 ${view} ${view}`} class="aspect-square h-full max-h-full" role="presentation">
    <g transform={`rotate(-90 ${center} ${center})`}>
      {#each arcs as a, i (`t${i}`)}
        <circle cx={center} cy={center} r={a.r} fill="none" stroke="currentColor" stroke-width={stroke} class="text-border" opacity="0.35" />
      {/each}
      {#each arcs as a, i (`v${i}`)}
        <circle
          cx={center}
          cy={center}
          r={a.r}
          fill="none"
          stroke={a.color}
          stroke-width={stroke}
          stroke-linecap="round"
          stroke-dasharray={a.dash}
        />
      {/each}
    </g>
    {#if showLabel}
      <text
        x={center}
        y={center}
        text-anchor="middle"
        dominant-baseline="middle"
        class="fill-foreground"
        font-size="26"
        font-weight="700"
      >
        {summary}
      </text>
    {/if}
  </svg>
</div>

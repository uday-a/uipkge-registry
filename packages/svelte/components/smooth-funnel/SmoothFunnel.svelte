<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface FunnelStage {
    name: string
    value: number
    /** Optional override; defaults to chart-1..N from the registry palette. */
    color?: string
  }

  export interface SmoothFunnelProps extends HTMLAttributes<HTMLDivElement> {
    data: FunnelStage[]
    /** Container height (px when numeric, raw CSS when string). Defaults to 240. */
    height?: number | string
    /** Show the percent pill on each stage. Defaults to true. */
    showLabels?: boolean
    /** Minimum segment height in px so tail stages stay visible at tiny percents. Default 18. */
    minHeight?: number
    /** Optional fallback palette when `color` is omitted on a stage. */
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
    data,
    height = 240,
    showLabels = true,
    minHeight = 18,
    colors = ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)', 'var(--chart-5)'],
    ariaLabel,
    ref = $bindable(null),
    ...restProps
  }: SmoothFunnelProps = $props()

  // SVG geometry. Width/height are virtual (the SVG fits to container
  // via viewBox). The aspect ratio (W:H ≈ 4:1) matches the horizontal
  // "flow" layout consumers typically want for a 4-6 stage funnel; if
  // you need taller bands, override `height` and the curves stretch
  // vertically without distorting horizontally.
  const W = 720
  const H = 180
  const cy = H / 2

  const segments = $derived.by(() => {
    const stages = data
    const n = stages.length
    if (n === 0) return []
    const segW = W / n
    const max = Math.max(...stages.map((s) => s.value))
    const pctOf = (v: number) => (max > 0 ? (v / max) * 100 : 0)
    const heightFor = (pct: number) => Math.max((pct / 100) * H, minHeight)

    return stages.map((s, i) => {
      const next = stages[i + 1] ?? s
      const startPct = pctOf(s.value)
      const endPct = pctOf(next.value)
      const h0 = heightFor(startPct)
      const h1 = heightFor(endPct)
      const x0 = i * segW
      const x1 = x0 + segW
      const yTop0 = cy - h0 / 2
      const yTop1 = cy - h1 / 2
      const yBot0 = cy + h0 / 2
      const yBot1 = cy + h1 / 2

      // Cubic bezier control points at 38% / 62% of segment width produce
      // a soft S-curve transition between stages rather than the
      // trapezoidal default of an ECharts funnel.
      const cx1 = x0 + segW * 0.38
      const cx2 = x0 + segW * 0.62

      const d = [
        `M ${x0.toFixed(1)} ${yTop0.toFixed(1)}`,
        `C ${cx1.toFixed(1)} ${yTop0.toFixed(1)}, ${cx2.toFixed(1)} ${yTop1.toFixed(1)}, ${x1.toFixed(1)} ${yTop1.toFixed(1)}`,
        `L ${x1.toFixed(1)} ${yBot1.toFixed(1)}`,
        `C ${cx2.toFixed(1)} ${yBot1.toFixed(1)}, ${cx1.toFixed(1)} ${yBot0.toFixed(1)}, ${x0.toFixed(1)} ${yBot0.toFixed(1)}`,
        'Z',
      ].join(' ')

      return {
        d,
        color: s.color ?? colors[i % colors.length],
        percent: startPct,
        name: s.name,
        value: s.value,
        labelX: x0 + segW * 0.42,
        labelY: cy,
      }
    })
  })

  const heightStyle = $derived(/^\d+$/.test(String(height)) ? `${height}px` : String(height))
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -- focusable chart mirrors the Vue twin (keyboard focus ring on the chart). -->
<div
  bind:this={ref}
  data-uipkge=""
  data-slot="smooth-funnel"
  tabindex="0"
  style="height:{heightStyle}"
  class={cn('focus-visible:ring-ring w-full focus-visible:ring-2 focus-visible:outline-none', className)}
  {...restProps}
>
  <svg
    viewBox="0 0 {W} {H}"
    class="block h-full w-full"
    preserveAspectRatio="none"
    role="img"
    aria-label={ariaLabel || 'Chart'}
  >
    {#each segments as seg, i (i)}
      <g>
        <path d={seg.d} fill={seg.color} />
        {#if showLabels}
          <foreignObject x={seg.labelX - 28} y={seg.labelY - 12} width="56" height="24">
            <div
              class="bg-background text-foreground inline-flex h-6 items-center rounded-full border px-2 text-xs font-semibold shadow-sm"
            >
              {Math.round(seg.percent * 10) / 10}%
            </div>
          </foreignObject>
        {/if}
      </g>
    {/each}
  </svg>
</div>

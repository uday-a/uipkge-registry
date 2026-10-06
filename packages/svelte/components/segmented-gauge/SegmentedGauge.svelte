<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  export interface GaugeSegment {
    /** Relative size of the segment. Segments are normalised by their sum. */
    value: number
    /** Optional override; defaults to chart-1..N from the registry palette. */
    color?: string
    /** Optional label, surfaced for consumers that want to render their own legend. */
    label?: string
  }

  export interface SegmentedGaugeProps extends HTMLAttributes<HTMLDivElement> {
    segments: GaugeSegment[]
    /** Container height (px when numeric, raw CSS when string). Default 200. */
    height?: number | string
    /** Stroke width of the arc in SVG units. Default 18. */
    stroke?: number
    /** Angular gap between segments, in degrees. Default 4. */
    gap?: number
    /** Optional fallback palette when `color` is omitted on a segment. */
    colors?: string[]
    /** Show a faint background track behind the arc. Default true. */
    showTrack?: boolean
    /** Accessible name announced for the chart image. Defaults to "Chart". */
    ariaLabel?: string
    /** KPI value + label dropped into the dish of the gauge. */
    center?: Snippet
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let {
    class: className,
    segments,
    height = 200,
    stroke = 18,
    gap = 4,
    colors = ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)', 'var(--chart-5)'],
    showTrack = true,
    ariaLabel,
    center,
    ref = $bindable(null),
    ...restProps
  }: SegmentedGaugeProps = $props()

  // SVG geometry. The viewBox uses the centre + radius + stroke so the
  // canvas grows with the stroke width and the center snippet can sit
  // underneath without overlapping the arc.
  const cx = 140
  const cy = 124
  const r = 100

  function polar(angleDeg: number) {
    const a = ((angleDeg - 90) * Math.PI) / 180
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as const
  }

  function arcPath(startA: number, endA: number) {
    const [sx, sy] = polar(startA)
    const [ex, ey] = polar(endA)
    const largeArc = endA - startA > 180 ? 1 : 0
    return `M ${sx.toFixed(2)} ${sy.toFixed(2)} A ${r} ${r} 0 ${largeArc} 1 ${ex.toFixed(2)} ${ey.toFixed(2)}`
  }

  const startAngle = 180
  const sweep = 180

  const arcs = $derived.by(() => {
    const total = segments.reduce((acc, s) => acc + s.value, 0) || 1
    let cursor = startAngle
    return segments.map((s, i) => {
      const span = (s.value / total) * sweep
      const isLast = i === segments.length - 1
      const segEnd = cursor + span - (isLast ? 0 : gap)
      const arc = { d: arcPath(cursor, segEnd), color: s.color ?? colors[i % colors.length] }
      cursor = cursor + span
      return arc
    })
  })

  const trackPath = arcPath(startAngle, startAngle + sweep)
  const heightStyle = $derived(/^\d+$/.test(String(height)) ? `${height}px` : String(height))
</script>

<div
  bind:this={ref}
  data-uipkge
  data-slot="segmented-gauge"
  tabindex="0"
  style="height: {heightStyle};"
  class={cn('focus-visible:ring-ring relative w-full focus-visible:ring-2 focus-visible:outline-none', className)}
  {...restProps}
>
  <svg
    viewBox="0 0 {cx * 2} {cy + stroke}"
    class="block h-full w-full"
    preserveAspectRatio="xMidYMid meet"
    role="img"
    aria-label={ariaLabel || 'Chart'}
  >
    {#if showTrack}
      <path
        d={trackPath}
        fill="none"
        stroke="currentColor"
        stroke-width={stroke}
        stroke-linecap="round"
        class="text-muted/40"
        opacity="0.35"
      />
    {/if}
    {#each arcs as a (a.d)}
      <path d={a.d} fill="none" stroke={a.color} stroke-width={stroke} stroke-linecap="round" />
    {/each}
  </svg>
  {#if center}
    <div class="pointer-events-none absolute inset-x-0 bottom-[8%] flex flex-col items-center">
      {@render center()}
    </div>
  {/if}
</div>

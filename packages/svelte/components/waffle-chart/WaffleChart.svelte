<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface WaffleSlice {
    name: string
    value: number
    color?: string
  }

  export interface WaffleChartProps extends HTMLAttributes<HTMLDivElement> {
    data: WaffleSlice[]
    height?: number | string
    /** Cells per side (total = size²). Default 10. */
    size?: number
    /** Cell corner radius. Default 2. */
    radius?: number
    showLegend?: boolean
    colors?: string[]
    /** Accessible name announced for the chart image. */
    ariaLabel?: string
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let {
    data,
    height = 260,
    size = 10,
    radius = 2,
    showLegend = true,
    colors = ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)', 'var(--chart-5)'],
    class: className,
    ariaLabel,
    ...restProps
  }: WaffleChartProps = $props()

  const heightStyle = $derived(/^\d+$/.test(String(height)) ? `${height}px` : String(height))
  const total = $derived(data.reduce((s, d) => s + d.value, 0) || 1)

  const cells = $derived.by(() => {
    const n = size * size
    const counts = data.map((d) => Math.floor((d.value / total) * n))
    let rest = n - counts.reduce((s, c) => s + c, 0)
    const remainders = data
      .map((d, i) => ({ i, r: (d.value / total) * n - counts[i]! }))
      .sort((a, b) => b.r - a.r)
    for (const { i } of remainders) {
      if (rest <= 0) break
      counts[i]!++
      rest--
    }
    const out: { color: string; name: string }[] = []
    data.forEach((d, i) => {
      for (let k = 0; k < counts[i]!; k++) out.push({ color: d.color ?? colors[i % colors.length]!, name: d.name })
    })
    return out.reverse()
  })

  const fallbackLabel = $derived(
    `Waffle chart: ${data.map((d) => `${d.name} ${Math.round((d.value / total) * 100)}%`).join(', ')}`,
  )
</script>

<div
  data-slot="waffle-chart"
  role="img"
  tabindex="0"
  aria-label={ariaLabel || fallbackLabel}
  style:height={heightStyle}
  class={cn(
    'focus-visible:ring-ring flex w-full items-center justify-center gap-5 focus-visible:ring-2 focus-visible:outline-none',
    className,
  )}
  {...restProps}
>
  <svg viewBox={`0 0 ${size * 12} ${size * 12}`} class="aspect-square h-full max-h-full" role="presentation">
    {#each cells as c, i (i)}
      <rect
        x={(i % size) * 12 + 1}
        y={Math.floor(i / size) * 12 + 1}
        width="10"
        height="10"
        rx={radius}
        fill={c.color}
      >
        <title>{c.name}</title>
      </rect>
    {/each}
  </svg>
  {#if showLegend}
    <ul class="space-y-1.5 text-xs">
      {#each data as d, i (d.name)}
        <li class="flex items-center gap-2">
          <span class="size-2.5 rounded-[3px]" style:background={d.color ?? colors[i % colors.length]}></span>
          <span class="text-foreground font-medium">{d.name}</span>
          <span class="text-muted-foreground tabular-nums">{Math.round((d.value / total) * 100)}%</span>
        </li>
      {/each}
    </ul>
  {/if}
</div>

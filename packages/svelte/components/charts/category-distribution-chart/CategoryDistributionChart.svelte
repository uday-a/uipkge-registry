<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface DistributionSlice {
    label: string
    /** Share of the whole; auto-normalised when the sum is not 100. */
    percentage: number
    value?: string | number
    color?: string
  }

  export interface CategoryDistributionChartProps extends HTMLAttributes<HTMLDivElement> {
    primaryValue: string | number
    primaryLabel?: string
    trend?: { value: string; direction: 'up' | 'down' }
    categories: DistributionSlice[]
    height?: number | string
    showLegend?: boolean
    colors?: string[]
    /** Accessible name announced for the chart image. Defaults to "Chart". */
    ariaLabel?: string
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let {
    class: className,
    primaryValue,
    primaryLabel,
    trend,
    categories,
    height = 220,
    showLegend = true,
    colors = ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)', 'var(--chart-5)'],
    ariaLabel,
    ...restProps
  }: CategoryDistributionChartProps = $props()

  const heightStyle = $derived(/^\d+$/.test(String(height)) ? `${height}px` : String(height))
  const total = $derived(categories.reduce((s, c) => s + c.percentage, 0) || 1)
  const slices = $derived(
    categories.map((c, i) => ({
      ...c,
      share: (c.percentage / total) * 100,
      color: c.color ?? colors[i % colors.length]!,
    })),
  )
</script>

<div
  data-uipkge
  data-slot="category-distribution-chart"
  role="img"
  aria-label={ariaLabel || 'Chart'}
  style="height: {heightStyle};"
  class={cn('flex w-full flex-col justify-center', className)}
  {...restProps}
>
  <div class="flex items-baseline gap-2">
    <span class="text-foreground text-3xl font-bold tabular-nums">{primaryValue}</span>
    {#if trend}
      <span
        class="text-xs font-semibold tabular-nums"
        style="color: {trend.direction === 'up' ? 'var(--chart-2)' : 'var(--destructive)'};"
      >
        {trend.direction === 'up' ? '+' : '−'}{trend.value}
      </span>
    {/if}
    {#if primaryLabel}
      <span class="text-muted-foreground text-xs">{primaryLabel}</span>
    {/if}
  </div>
  <div class="mt-3 flex h-3 w-full overflow-hidden rounded-full" role="presentation">
    {#each slices as s (s.label)}
      <div
        class="h-full"
        style="width: {s.share}%; background: {s.color};"
        title={`${s.label} — ${Math.round(s.share)}%`}
      ></div>
    {/each}
  </div>
  {#if showLegend}
    <ul class="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
      {#each slices as s (s.label)}
        <li class="flex min-w-0 items-center gap-2">
          <span class="size-2.5 shrink-0 rounded-[3px]" style="background: {s.color};"></span>
          <span class="text-foreground truncate font-medium">{s.label}</span>
          <span class="text-muted-foreground ml-auto shrink-0 tabular-nums">{s.value ?? `${Math.round(s.share)}%`}</span>
        </li>
      {/each}
    </ul>
  {/if}
</div>

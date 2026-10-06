<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export type DayStatus = 'up' | 'degraded' | 'down' | 'unknown'

  export interface StatusDay {
    date: string
    status: DayStatus
  }

  export interface UptimeTrackerChartProps extends HTMLAttributes<HTMLDivElement> {
    days: StatusDay[]
    height?: number | string
    /** Gap between bars in px. Default 2. */
    gap?: number
    /** Bar corner radius in px. Default 2. */
    rounded?: number
    /** Show the legend row with the computed uptime %. Default true. */
    showLegend?: boolean
    /** Accessible name announced for the chart image. Defaults to "Chart". */
    ariaLabel?: string
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let {
    days,
    height = 48,
    gap = 2,
    rounded = 2,
    showLegend = true,
    class: className,
    ariaLabel,
    ref = $bindable(null),
    ...restProps
  }: UptimeTrackerChartProps = $props()

  const heightStyle = $derived(/^\d+$/.test(String(height)) ? `${height}px` : String(height))

  const COLORS: Record<DayStatus, string> = {
    up: 'var(--chart-2)',
    degraded: 'var(--chart-4)',
    down: 'var(--destructive)',
    unknown: 'var(--border)',
  }

  const uptime = $derived.by(() => {
    if (!days.length) return '—'
    const up = days.filter((d) => d.status === 'up').length
    return `${((up / days.length) * 100).toFixed(1)}%`
  })

  const summary = $derived.by(() => {
    const counts = (s: DayStatus) => days.filter((d) => d.status === s).length
    return `${counts('up')} up, ${counts('degraded')} degraded, ${counts('down')} down days`
  })
</script>

<div
  bind:this={ref}
  data-uipkge
  data-slot="uptime-tracker-chart"
  role="img"
  tabindex="0"
  aria-label={ariaLabel || `Uptime tracker: ${summary}`}
  class={cn('w-full focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none', className)}
  {...restProps}
>
  <div class="flex min-h-6 items-stretch" style="height: {heightStyle}; gap: {gap}px">
    {#each days as d, i (d.date + '-' + i)}
      <div
        class="min-w-0 flex-1"
        style="background: {COLORS[d.status]}; border-radius: {rounded}px"
        title="{d.date} — {d.status}"
      ></div>
    {/each}
  </div>
  {#if showLegend}
    <div class="mt-2 flex items-center gap-3 text-xs">
      <span class="font-semibold text-foreground tabular-nums">{uptime} uptime</span>
      <span class="text-muted-foreground">{days.length} days</span>
      <span class="ml-auto flex items-center gap-2">
        <span class="flex items-center gap-1"
          ><span class="size-2 rounded-[2px]" style="background: {COLORS.up}"></span>Up</span
        >
        <span class="flex items-center gap-1"
          ><span class="size-2 rounded-[2px]" style="background: {COLORS.degraded}"></span>Degraded</span
        >
        <span class="flex items-center gap-1"
          ><span class="size-2 rounded-[2px]" style="background: {COLORS.down}"></span>Down</span
        >
      </span>
    </div>
  {/if}
</div>

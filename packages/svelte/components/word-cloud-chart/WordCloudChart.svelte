<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface WordDatum {
    name: string
    value: number
  }

  export interface WordCloudChartProps extends HTMLAttributes<HTMLDivElement> {
    data: WordDatum[]
    height?: number | string
    /** Optional palette override. Defaults to chart-1..5 tokens. */
    colors?: string[]
    /** Accessible name announced for the chart image. */
    ariaLabel?: string
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let {
    data,
    height = 280,
    colors = ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)', 'var(--chart-5)'],
    class: className,
    ariaLabel,
    ...restProps
  }: WordCloudChartProps = $props()

  const heightStyle = $derived(/^\d+$/.test(String(height)) ? `${height}px` : String(height))

  const words = $derived.by(() => {
    if (!data.length) return []
    const vals = data.map((d) => d.value)
    const min = Math.min(...vals)
    const max = Math.max(...vals)
    const span = Math.max(1, max - min)
    return [...data]
      .sort((a, b) => b.value - a.value)
      .map((d, i) => ({
        ...d,
        size: 14 + ((d.value - min) / span) * 30,
        color: colors[i % colors.length]!,
        weight: d.value === max ? 700 : d.value >= min + span * 0.66 ? 600 : 500,
        opacity: 0.55 + ((d.value - min) / span) * 0.45,
      }))
  })
</script>

<div
  data-slot="word-cloud-chart"
  role="img"
  tabindex="0"
  aria-label={ariaLabel || 'Chart'}
  style:height={heightStyle}
  class={cn('focus-visible:ring-ring w-full overflow-hidden focus-visible:ring-2 focus-visible:outline-none', className)}
  {...restProps}
>
  <div class="flex h-full w-full flex-wrap items-center justify-center gap-x-4 gap-y-1 p-4">
    {#each words as w (w.name)}
      <span
        title={`${w.name}: ${w.value}`}
        style:font-size={`${Math.round(w.size)}px`}
        style:color={w.color}
        style:font-weight={w.weight}
        style:opacity={w.opacity}
        style:line-height={1.15}
        class="cursor-default transition-transform duration-150 hover:scale-110"
      >
        {w.name}
      </span>
    {/each}
  </div>
</div>

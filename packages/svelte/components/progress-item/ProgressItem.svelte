<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface ProgressItemProps extends HTMLAttributes<HTMLDivElement> {
    label: string
    value: number
    secondaryLabel?: string
    barClass?: string
    colorIndex?: number
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'
  import { Progress } from '$lib/components/ui/progress'

  let {
    class: className,
    label,
    value,
    secondaryLabel,
    barClass,
    colorIndex,
    ref = $bindable(null),
    ...restProps
  }: ProgressItemProps = $props()

  // Maps to canonical shadcn chart tokens (chart-1..5). Cycles through 5 hues.
  const barColors = [
    '[&_[data-slot=progress-indicator]]:bg-primary',
    '[&_[data-slot=progress-indicator]]:bg-[var(--chart-1)]',
    '[&_[data-slot=progress-indicator]]:bg-[var(--chart-2)]',
    '[&_[data-slot=progress-indicator]]:bg-[var(--chart-3)]',
    '[&_[data-slot=progress-indicator]]:bg-[var(--chart-4)]',
    '[&_[data-slot=progress-indicator]]:bg-[var(--chart-5)]',
  ]

  const colorClass = $derived(colorIndex !== undefined ? barColors[colorIndex % barColors.length] : '')
</script>

<div {...restProps} bind:this={ref} data-uipkge="" data-slot="progress-item" class={cn('group/progress space-y-1.5', className)}>
  <div class="flex items-center justify-between text-sm">
    <span class="font-medium">{label}</span>
    <span class="text-muted-foreground text-xs tabular-nums">{secondaryLabel ?? `${value}%`}</span>
  </div>
  <Progress {value} class={cn('h-2 transition-colors duration-200', colorClass, barClass)} />
</div>

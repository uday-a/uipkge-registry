<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'
  import type { GanttScale, GanttTask } from './types'

  export interface GanttProps extends HTMLAttributes<HTMLDivElement> {
    tasks: GanttTask[]
    scale?: GanttScale
    startDate?: string
    endDate?: string
    rowHeight?: number
    headerHeight?: number
    treeWidth?: number
    onscalechange?: (scale: GanttScale) => void
    ontaskclick?: (task: GanttTask) => void
    ontaskchange?: (task: GanttTask) => void
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { setContext, untrack } from 'svelte'
  import { cn } from '$lib/utils'
  import { GANTT_CONTEXT_KEY } from './context'

  let {
    class: className,
    tasks,
    scale = 'day',
    startDate,
    endDate,
    rowHeight = 40,
    headerHeight = 48,
    treeWidth = 280,
    onscalechange,
    ontaskclick,
    ontaskchange,
    children,
    ref = $bindable(null),
    ...restProps
  }: GanttProps = $props()

  // `untrack` — mirrors the Vue twin: the prop seeds initial state only,
  // later scale changes flow through context + `onscalechange`.
  let currentScale = $state<GanttScale>(untrack(() => scale))

  // Compute start and end dates from tasks if not explicitly provided
  const resolvedStartDate = $derived.by(() => {
    if (startDate) return new Date(startDate)
    if (tasks.length === 0) return new Date()
    const dates = tasks.map((t) => new Date(t.startDate).getTime())
    const min = Math.min(...dates)
    const d = new Date(min)
    d.setDate(d.getDate() - 3) // padding
    return d
  })

  const resolvedEndDate = $derived.by(() => {
    if (endDate) return new Date(endDate)
    if (tasks.length === 0) {
      const d = new Date()
      d.setDate(d.getDate() + 30)
      return d
    }
    const dates = tasks.map((t) => new Date(t.endDate).getTime())
    const max = Math.max(...dates)
    const d = new Date(max)
    d.setDate(d.getDate() + 7) // padding
    return d
  })

  const totalDays = $derived.by(() => {
    const diff = resolvedEndDate.getTime() - resolvedStartDate.getTime()
    return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)))
  })

  const columnWidth = $derived.by(() => {
    switch (currentScale) {
      case 'day':
        return 44
      case 'week':
        return 120
      case 'month':
        return 180
      case 'year':
        return 240
      default:
        return 44
    }
  })

  function applyScale(v: GanttScale) {
    currentScale = v
    onscalechange?.(v)
  }

  setContext(GANTT_CONTEXT_KEY, {
    get scale() {
      return currentScale
    },
    set scale(v: GanttScale) {
      applyScale(v)
    },
    setScale: applyScale,
    get startDate() {
      return resolvedStartDate
    },
    get endDate() {
      return resolvedEndDate
    },
    get totalDays() {
      return totalDays
    },
    get columnWidth() {
      return columnWidth
    },
    get rowHeight() {
      return rowHeight
    },
    get headerHeight() {
      return headerHeight
    },
    get treeWidth() {
      return treeWidth
    },
    get tasks() {
      return tasks
    },
    onTaskClick: (task: GanttTask) => ontaskclick?.(task),
    onTaskChange: (task: GanttTask) => ontaskchange?.(task),
  })
</script>

<div
  bind:this={ref}
  data-uipkge
  data-slot="gantt"
  class={cn(
    'border-border bg-card text-card-foreground relative flex w-full flex-col overflow-hidden rounded-xl border shadow-xs',
    className,
  )}
  {...restProps}
>
  {@render children?.()}
</div>

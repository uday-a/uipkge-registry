<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'
  import type { GanttTask } from './types'

  export interface GanttTimelineProps extends HTMLAttributes<HTMLDivElement> {
    showTodayLine?: boolean
    showDependencies?: boolean
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'
  import GanttBar from './GanttBar.svelte'
  import GanttMilestone from './GanttMilestone.svelte'
  import { getGanttContext } from './context'

  let {
    class: className,
    showTodayLine = true,
    showDependencies = true,
    ref = $bindable(null),
    ...restProps
  }: GanttTimelineProps = $props()

  const ctx = getGanttContext()

  const timelineTasks = $derived<GanttTask[]>(ctx?.tasks ?? [])

  // Generate header date columns
  const columns = $derived.by(() => {
    if (!ctx) return []
    const list: { date: Date; label: string; subLabel: string; isWeekend: boolean }[] = []
    const start = new Date(ctx.startDate)
    const total = ctx.totalDays

    for (let i = 0; i < total; i++) {
      const d = new Date(start)
      d.setDate(d.getDate() + i)
      const dayOfWeek = d.getDay()
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6

      list.push({
        date: d,
        label: d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        subLabel: d.toLocaleDateString(undefined, { weekday: 'narrow' }),
        isWeekend,
      })
    }
    return list
  })

  const timelineWidth = $derived.by(() => {
    if (!ctx) return 800
    return columns.length * ctx.columnWidth
  })

  function getTaskCoordinates(task: GanttTask, index: number) {
    if (!ctx) return { left: 0, width: 100, top: 0, height: 28 }
    const start = new Date(ctx.startDate).getTime()
    const taskStart = new Date(task.startDate).getTime()
    const taskEnd = new Date(task.endDate).getTime()
    const oneDay = 1000 * 60 * 60 * 24

    const startDiffDays = Math.max(0, (taskStart - start) / oneDay)
    const durationDays = Math.max(1, (taskEnd - taskStart) / oneDay)

    const left = startDiffDays * ctx.columnWidth
    const width = durationDays * ctx.columnWidth
    const rowHeight = ctx.rowHeight
    const top = index * rowHeight + (rowHeight - 28) / 2

    return { left, width, top, height: 28 }
  }

  const todayPosition = $derived.by(() => {
    if (!ctx) return null
    const start = new Date(ctx.startDate).getTime()
    const today = new Date().setHours(0, 0, 0, 0)
    const oneDay = 1000 * 60 * 60 * 24
    const diffDays = (today - start) / oneDay

    if (diffDays < 0 || diffDays > ctx.totalDays) return null
    return diffDays * ctx.columnWidth + ctx.columnWidth / 2
  })

  // Compute SVG Dependency curves between tasks
  const dependencyPaths = $derived.by(() => {
    if (!ctx || !showDependencies) return []
    const tasksList: GanttTask[] = ctx.tasks ?? []
    const taskMap = new Map<string, { task: GanttTask; index: number }>()
    tasksList.forEach((t, i) => taskMap.set(t.id, { task: t, index: i }))

    const paths: { d: string; fromId: string; toId: string }[] = []

    tasksList.forEach((toTask, toIdx) => {
      if (!toTask.dependencies || toTask.dependencies.length === 0) return
      toTask.dependencies.forEach((fromId) => {
        const fromEntry = taskMap.get(fromId)
        if (!fromEntry) return

        const fromCoords = getTaskCoordinates(fromEntry.task, fromEntry.index)
        const toCoords = getTaskCoordinates(toTask, toIdx)

        const startX = fromEntry.task.isMilestone ? fromCoords.left : fromCoords.left + fromCoords.width
        const startY = fromCoords.top + 14

        const endX = toCoords.left
        const endY = toCoords.top + 14

        const deltaX = Math.max(16, (endX - startX) / 2)
        const d = `M ${startX} ${startY} C ${startX + deltaX} ${startY}, ${endX - deltaX} ${endY}, ${endX} ${endY}`
        paths.push({ d, fromId, toId: toTask.id })
      })
    })

    return paths
  })
</script>

<div
  bind:this={ref}
  data-uipkge
  data-slot="gantt-timeline"
  class={cn('bg-background relative flex-1 overflow-x-auto overflow-y-hidden select-none', className)}
  {...restProps}
>
  <div style={`width: ${timelineWidth}px`} class="relative">
    <!-- Header Dates -->
    <div
      style={`height: ${ctx?.headerHeight ?? 48}px`}
      class="border-border bg-muted/10 sticky top-0 z-20 flex border-b"
    >
      {#each columns as col, i (i)}
        <div
          style={`width: ${ctx?.columnWidth ?? 44}px`}
          class={cn(
            'border-border/50 text-muted-foreground flex flex-col items-center justify-center border-r text-[10px]',
            col.isWeekend && 'bg-muted/20 text-muted-foreground/60',
          )}
        >
          <span class="text-foreground font-medium">{col.label}</span>
          <span class="text-[9px]">{col.subLabel}</span>
        </div>
      {/each}
    </div>

    <!-- Grid Background & Task Bars -->
    <div class="relative">
      <!-- Column grid lines -->
      <div class="pointer-events-none absolute inset-0 flex">
        {#each columns as col, i (i)}
          <div
            style={`width: ${ctx?.columnWidth ?? 44}px`}
            class={cn('border-border/30 h-full border-r', col.isWeekend && 'bg-muted/15')}
          ></div>
        {/each}
      </div>

      <!-- Today Marker Line -->
      {#if showTodayLine && todayPosition != null}
        <div
          style={`left: ${todayPosition}px`}
          class="pointer-events-none absolute inset-y-0 z-30 flex flex-col items-center"
        >
          <div class="bg-destructive text-destructive-foreground rounded-full px-1.5 py-0.5 text-[9px] font-bold shadow-xs">
            Today
          </div>
          <div class="bg-destructive/60 h-full w-[1.5px] border-r border-dashed"></div>
        </div>
      {/if}

      <!-- SVG Dependencies Overlay -->
      {#if dependencyPaths.length > 0}
        <svg
          width={timelineWidth}
          height={(ctx?.tasks.length ?? 0) * (ctx?.rowHeight ?? 40)}
          class="pointer-events-none absolute inset-0 z-10"
        >
          <defs>
            <marker id="gantt-arrow" viewBox="0 0 6 6" refX="5" refY="3" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M 0 0 L 6 3 L 0 6 z" class="fill-primary/60" />
            </marker>
          </defs>
          {#each dependencyPaths as p, i (i)}
            <path
              d={p.d}
              fill="none"
              class="stroke-primary/50"
              stroke-width="1.5"
              stroke-dasharray="3,3"
              marker-end="url(#gantt-arrow)"
            />
          {/each}
        </svg>
      {/if}

      <!-- Task Rows & Bars -->
      {#each timelineTasks as task, idx (task.id)}
        {@const coords = getTaskCoordinates(task, idx)}
        {@const rowHeight = ctx?.rowHeight ?? 40}
        <div style={`height: ${rowHeight}px`} class="border-border/40 hover:bg-muted/10 relative border-b transition-colors">
          {#if task.isMilestone}
            <GanttMilestone
              {task}
              left={coords.left}
              top={rowHeight / 2}
              onclick={(t) => ctx?.onTaskClick(t)}
            />
          {:else}
            <GanttBar
              {task}
              left={coords.left}
              width={coords.width}
              top={(coords.height - 28) / 2 + 6}
              height={28}
              onclick={(t) => ctx?.onTaskClick(t)}
            />
          {/if}
        </div>
      {/each}
    </div>
  </div>
</div>

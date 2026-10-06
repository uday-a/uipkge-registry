<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface GanttTreeProps extends HTMLAttributes<HTMLDivElement> {
    showAssignee?: boolean
    showPriority?: boolean
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { ChevronDown, ChevronRight, Flag } from '@lucide/svelte'
  import { cn } from '$lib/utils'
  import { getGanttContext } from './context'

  let {
    class: className,
    showAssignee = true,
    showPriority = true,
    ref = $bindable(null),
    ...restProps
  }: GanttTreeProps = $props()

  // `showAssignee` is accepted for Vue-twin parity but unused (also unused
  // there). Destructured so it stays out of `...restProps`.
  const ctx = getGanttContext()

  const priorityColors: Record<string, string> = {
    urgent: 'text-destructive',
    high: 'text-amber-500',
    medium: 'text-primary',
    low: 'text-muted-foreground/60',
  }

  function calculateDays(startDate: string, endDate: string) {
    const diff = new Date(endDate).getTime() - new Date(startDate).getTime()
    const days = Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)))
    return `${days}d`
  }
</script>

<div
  bind:this={ref}
  data-uipkge
  data-slot="gantt-tree"
  style={`width: ${ctx?.treeWidth ?? 300}px`}
  class={cn('border-border bg-card flex shrink-0 flex-col border-r transition-[width] select-none', className)}
  {...restProps}
>
  <!-- Column Headers -->
  <div
    style={`height: ${ctx?.headerHeight ?? 48}px`}
    class="border-border bg-muted/20 text-muted-foreground flex items-center justify-between border-b px-3 text-xs font-semibold tracking-wider uppercase"
  >
    <span class="flex-1 truncate">Deliverable</span>
    {#if showPriority}
      <span class="w-12 shrink-0 text-center">Pri</span>
    {/if}
    <span class="w-16 shrink-0 text-right">Duration</span>
  </div>

  <!-- Rows List -->
  <div class="divide-border/40 flex-1 divide-y overflow-y-auto">
    {#each (ctx?.tasks ?? []) as task (task.id)}
      <div
        style={`height: ${ctx?.rowHeight ?? 40}px`}
        class={cn(
          'group/row text-foreground hover:bg-muted/40 flex cursor-pointer items-center justify-between px-3 text-xs transition-colors',
          task.isGroup && 'bg-muted/10 font-semibold',
        )}
        onclick={() => ctx?.onTaskClick(task)}
        onkeydown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            ctx?.onTaskClick(task)
          }
        }}
        role="button"
        tabindex="0"
      >
        <!-- Task Name & Chevron / Indent -->
        <div class="flex min-w-0 flex-1 items-center gap-1.5 pr-2">
          {#if task.isGroup || (task.children && task.children.length > 0)}
            <button
              type="button"
              class="text-muted-foreground hover:text-foreground flex size-4 shrink-0 items-center justify-center rounded-xs p-0.5"
              onclick={(e) => {
                e.stopPropagation()
                ctx?.toggleExpand?.(task.id)
              }}
            >
              {#if task.isExpanded !== false}
                <ChevronDown class="size-3" />
              {:else}
                <ChevronRight class="size-3" />
              {/if}
            </button>
          {:else if task.parentId}
            <span class="w-4 shrink-0"></span>
          {/if}

          <!-- Status Indicator Dot -->
          {#if task.status}
            <span
              class={cn(
                'size-2 shrink-0 rounded-full',
                task.status === 'done' && 'bg-emerald-500 ring-2 ring-emerald-500/20',
                task.status === 'in-progress' && 'bg-primary ring-primary/20 ring-2',
                task.status === 'at-risk' && 'bg-amber-500 ring-2 ring-amber-500/20',
                task.status === 'todo' && 'bg-muted-foreground/40',
                task.status === 'blocked' && 'bg-destructive ring-destructive/20 ring-2',
              )}
            ></span>
          {/if}

          <span class="truncate font-medium">{task.name}</span>
        </div>

        <!-- Priority Flag -->
        {#if showPriority}
          <div class="flex w-12 shrink-0 items-center justify-center">
            {#if task.priority}
              <Flag class={cn('size-3', priorityColors[task.priority])} />
            {/if}
          </div>
        {/if}

        <!-- Duration / Due Date Tag -->
        <div class="text-muted-foreground w-16 shrink-0 text-right font-mono text-xs">
          {#if task.isMilestone}
            <span class="text-xs font-semibold text-amber-500"> Milestone </span>
          {:else}
            {calculateDays(task.startDate, task.endDate)}
          {/if}
        </div>
      </div>
    {/each}
  </div>
</div>

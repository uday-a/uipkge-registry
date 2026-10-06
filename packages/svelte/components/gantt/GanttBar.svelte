<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'
  import type { GanttTask } from './types'

  // `onclick` carries the clicked task (not the MouseEvent), so it replaces
  // the DOM handler from HTMLAttributes.
  export interface GanttBarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onclick'> {
    task: GanttTask
    left: number
    width: number
    top: number
    height: number
    onclick?: (task: GanttTask) => void
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let {
    class: className,
    task,
    left,
    width,
    top,
    height,
    onclick,
    ref = $bindable(null),
    ...restProps
  }: GanttBarProps = $props()

  const statusColors: Record<string, string> = {
    done: 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/40',
    'in-progress': 'bg-primary/20 text-primary border-primary/40',
    'at-risk': 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/40',
    todo: 'bg-muted/80 text-muted-foreground border-border',
    blocked: 'bg-destructive/20 text-destructive border-destructive/40',
  }

  const progressColors: Record<string, string> = {
    done: 'bg-emerald-500/40',
    'in-progress': 'bg-primary/40',
    'at-risk': 'bg-amber-500/40',
    todo: 'bg-muted-foreground/20',
    blocked: 'bg-destructive/40',
  }

  function handleActivate() {
    onclick?.(task)
  }
</script>

{#if task.isGroup}
  <!-- Group Parent Task Bracket Bar -->
  <div
    bind:this={ref}
    data-uipkge
    data-slot="gantt-group-bar"
    role="button"
    tabindex="0"
    style={`left: ${left}px; width: ${Math.max(24, width)}px; top: ${top + 4}px; height: ${height - 8}px`}
    class={cn(
      'group/bar bg-foreground/80 text-background hover:bg-foreground absolute z-10 flex cursor-pointer items-center justify-between rounded-xs px-2 text-xs font-semibold shadow-xs select-none',
      className,
    )}
    onclick={handleActivate}
    onkeydown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        handleActivate()
      }
    }}
    {...restProps}
  >
    <span class="truncate">{task.name}</span>
    {#if task.progress != null}
      <span class="font-mono text-xs opacity-80"> {task.progress}% </span>
    {/if}
  </div>
{:else}
  <!-- Standard Deliverable Bar -->
  <div
    bind:this={ref}
    data-uipkge
    data-slot="gantt-bar"
    role="button"
    tabindex="0"
    style={`left: ${left}px; width: ${Math.max(24, width)}px; top: ${top}px; height: ${height}px`}
    class={cn(
      'group/bar absolute z-10 flex cursor-pointer items-center overflow-hidden rounded-md border text-xs font-medium shadow-xs transition-[box-shadow,transform] select-none hover:scale-[1.01] hover:shadow-md',
      task.color ? task.color : statusColors[task.status ?? 'in-progress'],
      className,
    )}
    onclick={handleActivate}
    onkeydown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        handleActivate()
      }
    }}
    {...restProps}
  >
    <!-- Progress fill -->
    {#if task.progress != null && task.progress > 0}
      <div
        style={`width: ${task.progress}%`}
        class={cn('absolute inset-y-0 left-0 transition-[width]', progressColors[task.status ?? 'in-progress'])}
      ></div>
    {/if}

    <!-- Content -->
    <div class="relative z-10 flex w-full min-w-0 items-center justify-between px-2">
      <span class="truncate font-medium">{task.name}</span>
      {#if task.progress != null}
        <span class="ml-1 shrink-0 font-mono text-xs opacity-80">
          {task.progress}%
        </span>
      {/if}
    </div>

    <!-- Left / Right Resize Handles -->
    <div
      aria-hidden="true"
      class="bg-foreground/20 absolute inset-y-0 left-0 w-1.5 cursor-ew-resize opacity-0 transition-opacity group-hover/bar:opacity-100"
    ></div>
    <div
      aria-hidden="true"
      class="bg-foreground/20 absolute inset-y-0 right-0 w-1.5 cursor-ew-resize opacity-0 transition-opacity group-hover/bar:opacity-100"
    ></div>
  </div>
{/if}

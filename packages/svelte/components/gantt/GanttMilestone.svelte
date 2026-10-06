<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'
  import type { GanttTask } from './types'

  // `onclick` carries the clicked task (not the MouseEvent), so it replaces
  // the DOM handler from HTMLAttributes.
  export interface GanttMilestoneProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onclick'> {
    task: GanttTask
    left: number
    top: number
    size?: number
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
    top,
    size = 16,
    onclick,
    ref = $bindable(null),
    ...restProps
  }: GanttMilestoneProps = $props()

  function handleActivate() {
    onclick?.(task)
  }
</script>

<div
  bind:this={ref}
  data-uipkge
  data-slot="gantt-milestone"
  role="button"
  tabindex="0"
  style={`left: ${left - size / 2}px; top: ${top - size / 2}px; width: ${size}px; height: ${size}px`}
  class={cn(
    'border-primary bg-primary absolute z-20 rotate-45 cursor-pointer rounded-xs border-2 shadow-sm transition-transform hover:scale-125',
    className,
  )}
  title={`${task.name} (${task.startDate})`}
  onclick={handleActivate}
  onkeydown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleActivate()
    }
  }}
  {...restProps}
></div>

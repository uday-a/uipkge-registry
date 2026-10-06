<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import type { GanttScale } from './types'

  export interface GanttHeaderProps extends HTMLAttributes<HTMLDivElement> {
    title?: string
    showScaleSwitcher?: boolean
    showNavigation?: boolean
    /** Extra header actions (replaces the Vue `actions` slot). */
    actions?: Snippet
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { Calendar } from '@lucide/svelte'
  import { cn } from '$lib/utils'
  import { Button, ButtonGroup } from '$lib/components/ui/button'
  import { getGanttContext } from './context'

  let {
    class: className,
    title = 'Project Timeline',
    showScaleSwitcher = true,
    showNavigation = false,
    actions,
    ref = $bindable(null),
    ...restProps
  }: GanttHeaderProps = $props()

  // `showNavigation` is accepted for Vue-twin parity but unused (also unused
  // there). Destructured so it stays out of `...restProps`.
  const ctx = getGanttContext()

  function setScale(scale: GanttScale) {
    if (ctx) {
      ctx.scale = scale
    }
  }
</script>

<div
  bind:this={ref}
  data-uipkge
  data-slot="gantt-header"
  class={cn('border-border bg-muted/30 flex items-center justify-between border-b px-4 py-2.5', className)}
  {...restProps}
>
  <div class="flex items-center gap-2">
    <Calendar class="text-primary size-4" />
    <span class="text-foreground text-sm font-semibold">{title}</span>
  </div>

  <div class="flex items-center gap-3">
    {@render actions?.()}

    {#if showScaleSwitcher && ctx}
      <ButtonGroup>
        <Button size="xs" variant={ctx.scale === 'day' ? 'default' : 'outline'} onclick={() => setScale('day')}>
          Day
        </Button>
        <Button size="xs" variant={ctx.scale === 'week' ? 'default' : 'outline'} onclick={() => setScale('week')}>
          Week
        </Button>
        <Button size="xs" variant={ctx.scale === 'month' ? 'default' : 'outline'} onclick={() => setScale('month')}>
          Month
        </Button>
        <Button size="xs" variant={ctx.scale === 'year' ? 'default' : 'outline'} onclick={() => setScale('year')}>
          Year
        </Button>
      </ButtonGroup>
    {/if}
  </div>
</div>

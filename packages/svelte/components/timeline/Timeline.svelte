<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'
  import type { TimelineAlign, TimelineDensity, TimelineDirection, TimelineSide } from './context.svelte'

  export interface TimelineProps extends HTMLAttributes<HTMLDivElement> {
    direction?: TimelineDirection
    align?: TimelineAlign
    side?: TimelineSide
    density?: TimelineDensity
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'
  import { TimelineContextState, setTimelineContext } from './context.svelte'

  let {
    class: className,
    direction = 'vertical',
    align = 'start',
    side,
    density = 'default',
    children,
    ref = $bindable(null),
    ...restProps
  }: TimelineProps = $props()

  const ctx = new TimelineContextState()
  setTimelineContext(ctx)

  $effect(() => {
    ctx.direction = direction
    ctx.align = align
    ctx.side = side ?? (direction === 'horizontal' ? 'top' : 'left')
    ctx.density = density
  })
</script>

<div
  bind:this={ref}
  data-uipkge=""
  data-slot="timeline"
  data-direction={direction}
  data-align={align}
  class={cn('relative', direction === 'vertical' ? 'flex flex-col' : 'flex flex-row', className)}
  {...restProps}
>
  {@render children?.()}
</div>

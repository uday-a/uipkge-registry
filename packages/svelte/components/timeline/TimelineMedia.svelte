<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'
  import type { TimelineStatus } from './context.svelte'
  import type { TimelineMediaVariant } from './timeline.variants'

  export interface TimelineMediaProps extends HTMLAttributes<HTMLDivElement> {
    variant?: TimelineMediaVariant
    status?: TimelineStatus
    /** Manually hide the connector line. */
    hideConnector?: boolean
    /**
     * Color the connector line using the item's status
     * (success → green, error → red, etc.) instead of the neutral border.
     */
    coloredConnector?: boolean
    /** Line style for the connector. */
    lineStyle?: 'solid' | 'dashed' | 'dotted'
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'
  import { getTimelineItemContext } from './context.svelte'
  import { timelineMediaVariants } from './timeline.variants'

  let {
    class: className,
    variant = 'dot',
    status,
    hideConnector = false,
    coloredConnector = false,
    lineStyle = 'solid',
    children,
    ref = $bindable(null),
    ...restProps
  }: TimelineMediaProps = $props()

  const item = getTimelineItemContext()

  const direction = $derived(item?.direction ?? 'vertical')
  const isLast = $derived(item?.isLast ?? true)
  const effectiveStatus: TimelineStatus = $derived(status ?? item?.status ?? 'default')
  const showConnector = $derived(!hideConnector && !isLast)

  const connectorBgClass = $derived.by(() => {
    if (lineStyle === 'dashed') {
      return direction === 'vertical'
        ? 'border-l-2 border-dashed border-border bg-transparent w-0'
        : 'border-t-2 border-dashed border-border bg-transparent h-0'
    }
    if (lineStyle === 'dotted') {
      return direction === 'vertical'
        ? 'border-l-2 border-dotted border-border bg-transparent w-0'
        : 'border-t-2 border-dotted border-border bg-transparent h-0'
    }
    if (!coloredConnector) return 'bg-border'
    return {
      default: 'bg-primary',
      current: 'bg-primary',
      success: 'bg-success',
      warning: 'bg-warning',
      error: 'bg-destructive',
      info: 'bg-info',
      muted: 'bg-muted-foreground/40',
    }[effectiveStatus]
  })
</script>

<div
  bind:this={ref}
  data-uipkge=""
  data-slot="timeline-media"
  data-variant={variant}
  class={cn(
    'relative flex shrink-0 items-center',
    direction === 'vertical' ? 'flex-col self-stretch' : 'flex-row items-center self-stretch',
    className,
  )}
  {...restProps}
>
  <!-- Marker -->
  <div
    data-uipkge=""
    data-slot="timeline-media-marker"
    class={cn(
      timelineMediaVariants({ variant, status: effectiveStatus }),
      direction === 'vertical' && variant === 'dot' && 'mt-1',
    )}
  >
    {@render children?.()}
  </div>

  <!-- Connector line -->
  {#if showConnector}
    <div
      data-uipkge=""
      data-slot="timeline-media-connector"
      aria-hidden="true"
      class={cn(direction === 'vertical' ? 'my-1 w-px flex-1' : 'mx-1 h-px flex-1', connectorBgClass)}
    ></div>
  {/if}
</div>

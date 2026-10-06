<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import type { TimelineSide, TimelineStatus } from './context.svelte'

  export interface TimelineItemRenderArgs {
    index: number
    isLast: boolean
    side: TimelineSide
    status: TimelineStatus
  }

  export interface TimelineItemProps extends HTMLAttributes<HTMLDivElement> {
    side?: TimelineSide
    status?: TimelineStatus
    // Optional param keeps this assignable to the base `Snippet<[]>` while
    // still letting children read the render args.
    children?: Snippet<[TimelineItemRenderArgs?]>
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'
  import { TimelineItemContextState, getTimelineContext, setTimelineItemContext } from './context.svelte'

  let {
    class: className,
    side,
    status = 'default',
    children,
    ref = $bindable(null),
    ...restProps
  }: TimelineItemProps = $props()

  const ctx = getTimelineContext()
  const id = Symbol('TimelineItem')

  $effect(() => {
    ctx?.register(id)
    return () => ctx?.unregister(id)
  })

  const index = $derived(ctx ? ctx.itemIds.indexOf(id) : 0)
  const isFirst = $derived(index === 0)
  const isLast = $derived(ctx ? index === ctx.itemIds.length - 1 : false)

  const effectiveSide: TimelineSide = $derived.by(() => {
    if (side) return side
    if (!ctx) return 'left'
    if (ctx.align === 'center') {
      if (ctx.direction === 'vertical') {
        return index % 2 === 0 ? 'left' : 'right'
      }
      return index % 2 === 0 ? 'top' : 'bottom'
    }
    return ctx.side
  })

  const direction = $derived(ctx?.direction ?? 'vertical')
  const density = $derived(ctx?.density ?? 'default')
  const isCenter = $derived(ctx?.align === 'center')

  const verticalSpacing = $derived.by(() => {
    if (isLast) return ''
    return {
      compact: '[&>[data-slot=timeline-content]]:pb-3',
      default: '[&>[data-slot=timeline-content]]:pb-6',
      comfortable: '[&>[data-slot=timeline-content]]:pb-10',
    }[density]
  })

  const horizontalSpacing = $derived.by(() => {
    if (isLast) return ''
    return {
      compact: '[&>[data-slot=timeline-content]]:pr-3',
      default: '[&>[data-slot=timeline-content]]:pr-6',
      comfortable: '[&>[data-slot=timeline-content]]:pr-10',
    }[density]
  })

  const itemCtx = new TimelineItemContextState()
  setTimelineItemContext(itemCtx)

  $effect(() => {
    itemCtx.index = index
    itemCtx.isFirst = isFirst
    itemCtx.isLast = isLast
    itemCtx.side = effectiveSide
    itemCtx.status = status
    itemCtx.direction = direction
    itemCtx.density = density
  })
</script>

<div
  bind:this={ref}
  data-uipkge=""
  data-slot="timeline-item"
  data-side={effectiveSide}
  data-status={status}
  data-last={isLast || undefined}
  style:--timeline-stagger={`${Math.min(index, 12) * 55}ms`}
  class={cn(
    'timeline-item-enter relative',
    status === 'current' && 'timeline-item-current',
    !isCenter &&
      direction === 'vertical' && [
        'flex items-start gap-4',
        effectiveSide === 'right' && 'flex-row-reverse text-right',
        verticalSpacing,
      ],
    !isCenter &&
      direction === 'horizontal' && [
        'flex flex-col items-start gap-2',
        effectiveSide === 'bottom' && 'flex-col-reverse',
        horizontalSpacing,
      ],
    isCenter &&
      direction === 'vertical' && [
        'grid grid-cols-[1fr_auto_1fr] items-start gap-x-4',
        '[&>[data-slot=timeline-media]]:col-start-2 [&>[data-slot=timeline-media]]:row-start-1',
        '[&>[data-slot=timeline-separator]]:col-start-2 [&>[data-slot=timeline-separator]]:row-start-1',
        '[&>[data-slot=timeline-content]]:row-start-1',
        effectiveSide === 'left' &&
          '[&>[data-slot=timeline-content]]:col-start-1 [&>[data-slot=timeline-content]]:text-right',
        effectiveSide === 'right' && '[&>[data-slot=timeline-content]]:col-start-3',
        verticalSpacing,
      ],
    isCenter &&
      direction === 'horizontal' && [
        'grid grid-rows-[1fr_auto_1fr] items-start gap-y-2',
        '[&>[data-slot=timeline-media]]:col-start-1 [&>[data-slot=timeline-media]]:row-start-2',
        '[&>[data-slot=timeline-separator]]:col-start-1 [&>[data-slot=timeline-separator]]:row-start-2',
        '[&>[data-slot=timeline-content]]:col-start-1',
        effectiveSide === 'top' &&
          '[&>[data-slot=timeline-content]]:row-start-1 [&>[data-slot=timeline-content]]:self-end',
        effectiveSide === 'bottom' && '[&>[data-slot=timeline-content]]:row-start-3',
        horizontalSpacing,
      ],
    className,
  )}
  {...restProps}
>
  {@render children?.({ index, isLast, side: effectiveSide, status })}
</div>

<style>
  @keyframes timeline-item-enter {
    from {
      opacity: 0;
      transform: translateY(6px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes timeline-current-pulse {
    0%,
    100% {
      box-shadow: 0 0 0 0 color-mix(in oklab, var(--primary) 45%, transparent);
    }
    50% {
      box-shadow: 0 0 0 6px color-mix(in oklab, var(--primary) 0%, transparent);
    }
  }

  .timeline-item-enter {
    animation: timeline-item-enter 320ms cubic-bezier(0.22, 1, 0.36, 1) both;
    animation-delay: var(--timeline-stagger, 0ms);
  }

  /* Markers live in child components, so the descendant half must be global. */
  .timeline-item-current :global([data-slot='timeline-media-marker']),
  .timeline-item-current :global([data-slot='timeline-separator-marker']) {
    animation: timeline-current-pulse 1.8s ease-in-out infinite;
  }

  @media (prefers-reduced-motion: reduce) {
    .timeline-item-enter,
    .timeline-item-current :global([data-slot='timeline-media-marker']),
    .timeline-item-current :global([data-slot='timeline-separator-marker']) {
      animation: none !important;
    }
  }
</style>

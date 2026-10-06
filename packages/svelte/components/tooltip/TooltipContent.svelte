<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface TooltipContentProps extends HTMLAttributes<HTMLDivElement> {
    side?: 'top' | 'right' | 'bottom' | 'left'
    sideOffset?: number
    align?: 'start' | 'center' | 'end'
    alignOffset?: number
    /** Show the arrow pointer. Default true. */
    showArrow?: boolean
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'
  import { getTooltipRootState } from './context.svelte'

  let {
    class: className,
    side = 'top',
    sideOffset = 4,
    align = 'center',
    alignOffset = 0,
    showArrow = true,
    children,
    ref = $bindable(null),
    ...restProps
  }: TooltipContentProps = $props()

  const root = getTooltipRootState()

  const positionClass = $derived.by(() => {
    switch (side) {
      case 'top':
        return align === 'start'
          ? 'bottom-full left-0'
          : align === 'end'
            ? 'bottom-full right-0'
            : 'bottom-full left-1/2 -translate-x-1/2'
      case 'bottom':
        return align === 'start'
          ? 'top-full left-0'
          : align === 'end'
            ? 'top-full right-0'
            : 'top-full left-1/2 -translate-x-1/2'
      case 'left':
        return align === 'start'
          ? 'right-full top-0'
          : align === 'end'
            ? 'right-full bottom-0'
            : 'right-full top-1/2 -translate-y-1/2'
      case 'right':
        return align === 'start'
          ? 'left-full top-0'
          : align === 'end'
            ? 'left-full bottom-0'
            : 'left-full top-1/2 -translate-y-1/2'
    }
  })

  const arrowClass = $derived.by(() => {
    switch (side) {
      case 'top':
        return 'bottom-[-3px] left-1/2 -translate-x-1/2'
      case 'bottom':
        return 'top-[-3px] left-1/2 -translate-x-1/2'
      case 'left':
        return 'right-[-3px] top-1/2 -translate-y-1/2'
      case 'right':
        return 'left-[-3px] top-1/2 -translate-y-1/2'
    }
  })

  const offsetStyle = $derived.by(() => {
    const main = `${sideOffset}px`
    const cross = alignOffset ? `${alignOffset}px` : undefined
    const style: Record<string, string> = {}
    if (side === 'top') style['margin-bottom'] = main
    else if (side === 'bottom') style['margin-top'] = main
    else if (side === 'left') style['margin-right'] = main
    else style['margin-left'] = main
    if (cross) {
      if (side === 'top' || side === 'bottom') style['margin-left'] = cross
      else style['margin-top'] = cross
    }
    return Object.entries(style)
      .map(([k, v]) => `${k}: ${v}`)
      .join('; ')
  })
</script>

{#if root?.open}
  <div
    bind:this={ref}
    id={root.id}
    role="tooltip"
    data-uipkge=""
    data-slot="tooltip-content"
    data-side={side}
    data-align={align}
    data-state="open"
    class={cn(
      'bg-foreground text-background motion-safe:animate-in motion-safe:fade-in-0 motion-safe:zoom-in-95 motion-safe:data-[state=closed]:animate-out motion-safe:blur-in-2 motion-safe:data-[state=closed]:blur-out-2 motion-safe:data-[state=closed]:fade-out-0 motion-safe:data-[state=closed]:zoom-out-95 motion-safe:data-[side=bottom]:slide-in-from-top-2 motion-safe:data-[side=left]:slide-in-from-right-2 motion-safe:data-[side=right]:slide-in-from-left-2 motion-safe:data-[side=top]:slide-in-from-bottom-2 absolute z-50 w-fit rounded-md px-3 py-1.5 text-xs text-balance',
      positionClass,
      className,
    )}
    style={offsetStyle}
    {...restProps}
  >
    {@render children?.()}
    {#if showArrow}
      <div
        data-slot="tooltip-arrow"
        aria-hidden="true"
        class={cn(
          'bg-foreground fill-foreground absolute z-50 size-2.5 rotate-45 rounded-[2px]',
          arrowClass,
        )}
      ></div>
    {/if}
  </div>
{/if}

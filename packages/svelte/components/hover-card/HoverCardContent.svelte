<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  export type HoverCardSide = 'top' | 'right' | 'bottom' | 'left'
  export type HoverCardAlign = 'start' | 'center' | 'end'

  export interface HoverCardContentProps extends HTMLAttributes<HTMLDivElement> {
    side?: HoverCardSide
    align?: HoverCardAlign
    sideOffset?: number
    alignOffset?: number
    children?: Snippet
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'
  import { getHoverCardContext } from './HoverCard.svelte'

  let {
    class: className,
    side = 'bottom',
    align = 'center',
    sideOffset = 4,
    alignOffset = 0,
    children,
    ...restProps
  }: HoverCardContentProps = $props()

  const ctx = getHoverCardContext()

  // Absolute positioning against the root wrapper (no floating-ui / portal in
  // this hand-rolled port — the content anchors to the relatively-positioned
  // HoverCard root instead of document.body).
  const positionStyle = $derived.by(() => {
    const offset = `${sideOffset}px`
    let s = ''
    if (side === 'bottom') s += `top: calc(100% + ${offset});`
    else if (side === 'top') s += `bottom: calc(100% + ${offset});`
    else if (side === 'right') s += `left: calc(100% + ${offset});`
    else s += `right: calc(100% + ${offset});`

    if (side === 'bottom' || side === 'top') {
      if (align === 'start') s += `left: ${alignOffset}px;`
      else if (align === 'end') s += `right: ${-alignOffset}px;`
      else s += `left: calc(50% + ${alignOffset}px); transform: translateX(-50%);`
    } else {
      if (align === 'start') s += `top: ${alignOffset}px;`
      else if (align === 'end') s += `bottom: ${-alignOffset}px;`
      else s += `top: calc(50% + ${alignOffset}px); transform: translateY(-50%);`
    }
    return s
  })
</script>

{#if ctx.open}
  <div
    data-uipkge
    data-slot="hover-card-content"
    role="dialog"
    data-state="open"
    data-side={side}
    data-align={align}
    {...restProps}
    style={positionStyle}
    class={cn(
      'bg-popover text-popover-foreground motion-safe:data-[state=open]:animate-in motion-safe:data-[state=closed]:animate-out motion-safe:data-[state=open]:ease-emphasized motion-safe:data-[state=open]:blur-in-2 motion-safe:data-[state=closed]:blur-out-2 motion-safe:data-[state=closed]:fade-out-0 motion-safe:data-[state=open]:fade-in-0 motion-safe:data-[state=closed]:zoom-out-95 motion-safe:data-[state=open]:zoom-in-95 motion-safe:data-[side=bottom]:slide-in-from-top-2 motion-safe:data-[side=left]:slide-in-from-right-2 motion-safe:data-[side=right]:slide-in-from-left-2 motion-safe:data-[side=top]:slide-in-from-bottom-2 absolute z-50 w-64 rounded-md border p-4 shadow-md outline-hidden motion-safe:data-[state=closed]:duration-[var(--dur-exit)] motion-safe:data-[state=open]:duration-200',
      className,
    )}
    onmouseenter={ctx.cancelClose}
    onmouseleave={ctx.scheduleClose}
  >
    {@render children?.()}
  </div>
{/if}

<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface ContextMenuSubTriggerProps extends HTMLAttributes<HTMLDivElement> {
    inset?: boolean
    disabled?: boolean
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { ChevronRight } from '@lucide/svelte'
  import { cn } from '$lib/utils'
  import { getContextMenuSubContext } from './context'

  type OnClick = NonNullable<HTMLAttributes<HTMLDivElement>['onclick']>
  type OnMouseEnter = NonNullable<HTMLAttributes<HTMLDivElement>['onmouseenter']>
  type OnKeyDown = NonNullable<HTMLAttributes<HTMLDivElement>['onkeydown']>

  let {
    class: className,
    inset = false,
    disabled = false,
    children,
    ref = $bindable(null),
    onclick,
    onmouseenter,
    onkeydown,
    ...restProps
  }: ContextMenuSubTriggerProps = $props()

  const sub = getContextMenuSubContext()

  $effect(() => {
    sub.registerTriggerElement(ref)
    return () => sub.registerTriggerElement(null)
  })

  const handleClick: OnClick = (e) => {
    onclick?.(e)
    if (e.defaultPrevented || disabled) return
    sub.setOpen(!sub.open)
    if (!sub.open) sub.focusFirstItem()
  }

  const handleMouseEnter: OnMouseEnter = (e) => {
    onmouseenter?.(e)
    if (disabled) return
    ref?.focus()
    sub.setOpen(true)
  }

  const handleKeyDown: OnKeyDown = (e) => {
    onkeydown?.(e)
    if (e.defaultPrevented || disabled) return
    if (e.key === 'ArrowRight' || e.key === 'Enter') {
      e.preventDefault()
      sub.setOpen(true)
      sub.focusFirstItem()
    }
  }
</script>

<div
  bind:this={ref}
  data-uipkge
  data-slot="context-menu-sub-trigger"
  data-context-menu-item=""
  role="menuitem"
  tabindex="-1"
  aria-haspopup="menu"
  aria-expanded={sub.open}
  data-state={sub.open ? 'open' : 'closed'}
  data-inset={inset ? '' : undefined}
  data-disabled={disabled ? '' : undefined}
  aria-disabled={disabled || undefined}
  class={cn(
    "focus:bg-accent focus:text-accent-foreground focus-visible:ring-ring data-[state=open]:bg-accent data-[state=open]:text-accent-foreground flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-hidden select-none focus-visible:ring-2 focus-visible:ring-inset data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    className,
  )}
  {...restProps}
  onclick={handleClick}
  onmouseenter={handleMouseEnter}
  onkeydown={handleKeyDown}
>
  {@render children?.()}
  <ChevronRight class="ml-auto" aria-hidden="true" />
</div>

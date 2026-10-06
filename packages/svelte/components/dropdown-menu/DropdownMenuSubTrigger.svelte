<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface DropdownMenuSubTriggerProps extends HTMLAttributes<HTMLDivElement> {
    disabled?: boolean
    inset?: boolean
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { ChevronRight } from '@lucide/svelte'
  import { cn } from '$lib/utils'
  import { focusMenuItem, getSubContext } from './dropdown-menu-context'

  let {
    class: className,
    disabled = false,
    inset = false,
    children,
    ref = $bindable(null),
    onclick,
    ...restProps
  }: DropdownMenuSubTriggerProps = $props()

  const sub = getSubContext()
  const subOpen = $derived(sub.isSubOpen())

  function open() {
    if (disabled) return
    sub.setSubOpen(true)
  }

  function scheduleClose() {
    if (disabled) return
    sub.scheduleClose()
  }

  function toggle(e: Event) {
    if (disabled) return
    e.stopPropagation()
    sub.setSubOpen(!sub.isSubOpen())
  }
</script>

<div
  bind:this={ref}
  id={sub.ids.trigger}
  role="menuitem"
  tabindex={disabled ? undefined : -1}
  aria-haspopup="menu"
  aria-expanded={subOpen}
  aria-controls={sub.ids.content}
  aria-disabled={disabled || undefined}
  data-uipkge
  data-slot="dropdown-menu-sub-trigger"
  data-state={subOpen ? 'open' : 'closed'}
  data-inset={inset ? '' : undefined}
  data-disabled={disabled ? '' : undefined}
  class={cn(
    'focus:bg-accent focus:text-accent-foreground focus-visible:ring-ring data-[state=open]:bg-accent data-[state=open]:text-accent-foreground data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*=\'text-\'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none focus-visible:ring-2 focus-visible:ring-inset data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=\'size-\'])]:size-4',
    className,
  )}
  onclick={(e) => {
    toggle(e)
    onclick?.(e)
  }}
  onkeydown={(e) => {
    if (e.key === 'ArrowRight' && !subOpen) {
      e.preventDefault()
      open()
      focusMenuItem(sub.ids.content, 'first')
    } else if (e.key === 'ArrowLeft' && subOpen) {
      e.preventDefault()
      sub.setSubOpen(false)
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      toggle(e)
      if (!disabled && sub.isSubOpen()) focusMenuItem(sub.ids.content, 'first')
    }
  }}
  onmouseenter={open}
  onmouseleave={scheduleClose}
  onfocus={open}
  {...restProps}
>
  {@render children?.()}
  <ChevronRight class="ml-auto size-4" />
</div>

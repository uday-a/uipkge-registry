<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface DropdownMenuItemProps extends HTMLAttributes<HTMLDivElement> {
    disabled?: boolean
    inset?: boolean
    variant?: 'default' | 'destructive'
    /** Called on selection. Selecting an item closes the menu. */
    onSelect?: (e: Event) => void
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'
  import { getMenuContext } from './dropdown-menu-context'

  let {
    class: className,
    disabled = false,
    inset = false,
    variant = 'default',
    onSelect,
    children,
    ref = $bindable(null),
    onclick,
    ...restProps
  }: DropdownMenuItemProps = $props()

  const menu = getMenuContext()

  function select(e: Event) {
    if (disabled) return
    onSelect?.(e)
    menu.closeAndFocusTrigger()
  }
</script>

<div
  bind:this={ref}
  role="menuitem"
  tabindex={disabled ? undefined : -1}
  aria-disabled={disabled || undefined}
  data-uipkge
  data-slot="dropdown-menu-item"
  data-inset={inset ? '' : undefined}
  data-variant={variant}
  data-disabled={disabled ? '' : undefined}
  class={cn(
    'focus:bg-accent focus:text-accent-foreground focus-visible:ring-ring data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*=\'text-\'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none focus-visible:ring-2 focus-visible:ring-inset data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=\'size-\'])]:size-4',
    className,
  )}
  onclick={(e) => {
    select(e)
    onclick?.(e)
  }}
  onkeydown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      select(e)
    }
  }}
  {...restProps}
>
  {@render children?.()}
</div>

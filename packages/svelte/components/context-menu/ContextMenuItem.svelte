<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'
  import type { ContextMenuItemVariants } from './context-menu-item.variants'

  export interface ContextMenuItemProps extends HTMLAttributes<HTMLDivElement> {
    inset?: boolean
    variant?: ContextMenuItemVariants['variant']
    disabled?: boolean
    onSelect?: () => void
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'
  import { getContextMenuContext } from './context'
  import { contextMenuItemVariants } from './context-menu-item.variants'

  type OnClick = NonNullable<HTMLAttributes<HTMLDivElement>['onclick']>
  type OnMouseEnter = NonNullable<HTMLAttributes<HTMLDivElement>['onmouseenter']>

  let {
    class: className,
    inset = false,
    variant = 'default',
    disabled = false,
    onSelect,
    children,
    ref = $bindable(null),
    onclick,
    onmouseenter,
    ...restProps
  }: ContextMenuItemProps = $props()

  const ctx = getContextMenuContext()

  const handleClick: OnClick = (e) => {
    onclick?.(e)
    if (e.defaultPrevented || disabled) return
    onSelect?.()
    ctx.close()
  }

  const handleMouseEnter: OnMouseEnter = (e) => {
    onmouseenter?.(e)
    if (!disabled) ref?.focus()
  }
</script>

<div
  bind:this={ref}
  data-uipkge
  data-slot="context-menu-item"
  data-context-menu-item=""
  role="menuitem"
  tabindex="-1"
  data-inset={inset ? '' : undefined}
  data-variant={variant}
  data-disabled={disabled ? '' : undefined}
  aria-disabled={disabled || undefined}
  class={cn(contextMenuItemVariants({ variant, inset }), className)}
  {...restProps}
  onclick={handleClick}
  onmouseenter={handleMouseEnter}
>
  {@render children?.()}
</div>

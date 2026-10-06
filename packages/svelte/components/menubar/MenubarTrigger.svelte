<script lang="ts" module>
  import type { HTMLButtonAttributes } from 'svelte/elements'

  export interface MenubarTriggerProps extends HTMLButtonAttributes {
    disabled?: boolean
    ref?: HTMLButtonElement | null
  }
</script>

<script lang="ts">
  import { tick } from 'svelte'
  import { cn } from '$lib/utils'
  import { getMenubarMenuContext, getMenubarRootContext, getMenubarScopeContext } from './MenubarContext'

  let {
    class: className,
    disabled,
    children,
    ref = $bindable(null),
    onclick,
    onkeydown,
    onmouseenter,
    ...restProps
  }: MenubarTriggerProps = $props()

  const root = getMenubarRootContext()
  const menu = getMenubarMenuContext()
  const scope = getMenubarScopeContext()

  let el: HTMLButtonElement | null = $state(null)
  $effect(() => {
    ref = el
    menu?.setTriggerEl(el)
  })
  $effect(() => {
    if (menu && root) return root.registerTrigger(menu.id, () => el)
  })

  const isOpen = $derived(menu?.isOpen() ?? false)

  function openAndFocusFirst() {
    if (!menu || !root) return
    if (!isOpen) root.setOpenMenu(menu.id)
    tick().then(() => scope?.moveFocus(null, 'first'))
  }
</script>

<button
  bind:this={el}
  type="button"
  id={menu?.triggerId}
  aria-haspopup="menu"
  aria-expanded={isOpen}
  aria-controls={menu?.contentId}
  aria-disabled={disabled || undefined}
  data-uipkge=""
  data-slot="menubar-trigger"
  data-state={isOpen ? 'open' : 'closed'}
  data-disabled={disabled ? '' : undefined}
  {disabled}
  class={cn(
    'focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground flex items-center rounded-sm px-2 py-1 text-sm font-medium outline-hidden select-none',
    className,
  )}
  onclick={(e) => {
    if (disabled) return
    if (menu && root) root.setOpenMenu(isOpen ? null : menu.id)
    onclick?.(e)
  }}
  onmouseenter={(e) => {
    // Hovering a sibling trigger while a menu is open switches to it.
    if (!disabled && menu && root && root.getOpenMenu() !== null && root.getOpenMenu() !== menu.id) {
      root.setOpenMenu(menu.id)
    }
    onmouseenter?.(e)
  }}
  onkeydown={(e) => {
    if (disabled) {
      onkeydown?.(e)
      return
    }
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      openAndFocusFirst()
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault()
      if (menu && root) {
        const next = root.focusSiblingTrigger(menu.id, e.key === 'ArrowRight' ? 1 : -1)
        // When a menu is already open, arrows switch the open menu.
        if (next && root.getOpenMenu() !== null) root.setOpenMenu(next)
      }
    } else if (e.key === 'Escape') {
      if (isOpen && menu && root) {
        e.preventDefault()
        root.setOpenMenu(null)
      }
    }
    onkeydown?.(e)
  }}
  {...restProps}
>
  {@render children?.()}
</button>

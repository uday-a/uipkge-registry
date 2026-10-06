<script lang="ts" module>
  import type { HTMLButtonAttributes } from 'svelte/elements'

  export interface NavigationMenuTriggerProps extends HTMLButtonAttributes {
    disabled?: boolean
    ref?: HTMLButtonElement | null
  }
</script>

<script lang="ts">
  import { tick } from 'svelte'
  import { ChevronDown } from '@lucide/svelte'
  import { cn } from '$lib/utils'
  import { getNavigationMenuItemContext, getNavigationMenuRootContext } from './NavigationMenuContext'
  import { navigationMenuTriggerStyle } from './navigation-menu.variants'

  let {
    class: className,
    disabled,
    children,
    ref = $bindable(null),
    onclick,
    onkeydown,
    onmouseenter,
    onmouseleave,
    ...restProps
  }: NavigationMenuTriggerProps = $props()

  const root = getNavigationMenuRootContext()
  const item = getNavigationMenuItemContext()

  let el: HTMLButtonElement | null = $state(null)
  $effect(() => {
    ref = el
    item?.setTriggerEl(el)
  })
  $effect(() => {
    if (item && root) {
      const v = item.value
      return root.registerTrigger(v, () => el)
    }
  })

  const isOpen = $derived(item?.isOpen() ?? false)

  function focusFirstInContent() {
    tick().then(() => {
      root
        ?.getContentEl()
        ?.querySelector<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')
        ?.focus()
    })
  }
</script>

<button
  bind:this={el}
  type="button"
  id={item?.triggerId}
  aria-expanded={isOpen}
  aria-controls={item?.contentId}
  aria-disabled={disabled || undefined}
  data-uipkge=""
  data-slot="navigation-menu-trigger"
  data-state={isOpen ? 'open' : 'closed'}
  data-disabled={disabled ? '' : undefined}
  {disabled}
  class={cn(navigationMenuTriggerStyle(), 'group', className)}
  onclick={(e) => {
    if (disabled) return
    if (item && root) root.setValue(isOpen ? undefined : item.value)
    onclick?.(e)
  }}
  onmouseenter={(e) => {
    if (!disabled && item && root) root.openWithDelay(item.value)
    onmouseenter?.(e)
  }}
  onmouseleave={(e) => {
    root?.cancelDelayedOpen()
    onmouseleave?.(e)
  }}
  onkeydown={(e) => {
    if (disabled) {
      onkeydown?.(e)
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (item && root) {
        if (!isOpen) root.setValue(item.value)
        focusFirstInContent()
      }
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault()
      if (item && root) {
        const next = root.focusSiblingTrigger(item.value, e.key === 'ArrowRight' ? 1 : -1)
        if (next && root.getValue() !== undefined) root.setValue(next)
      }
    } else if (e.key === 'Home') {
      e.preventDefault()
      if (item && root) root.focusSiblingTrigger(item.value, 'first')
    } else if (e.key === 'End') {
      e.preventDefault()
      if (item && root) root.focusSiblingTrigger(item.value, 'last')
    } else if (e.key === 'Escape') {
      if (isOpen && root) {
        e.preventDefault()
        root.setValue(undefined)
      }
    }
    onkeydown?.(e)
  }}
  {...restProps}
>
  {@render children?.()}
  <ChevronDown
    class="relative top-[1px] ml-1 size-3 transition duration-300 group-data-[state=open]:rotate-180"
    aria-hidden="true"
  />
</button>

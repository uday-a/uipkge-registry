<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface MenubarSubTriggerProps extends HTMLAttributes<HTMLDivElement> {
    disabled?: boolean
    inset?: boolean
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { tick } from 'svelte'
  import { ChevronRight } from '@lucide/svelte'
  import { cn } from '$lib/utils'
  import { getMenubarScopeContext, getMenubarSubContext } from './MenubarContext'

  let {
    class: className,
    disabled = false,
    inset = false,
    children,
    ref = $bindable(null),
    onclick,
    onkeydown,
    ...restProps
  }: MenubarSubTriggerProps = $props()

  const sub = getMenubarSubContext()
  // The sub shadows the parent scope for its *content*, but the trigger
  // itself registers with the parent scope so arrows flow through it.
  const parentScope = $derived(sub?.parentScope ?? null)
  const subScope = getMenubarScopeContext()

  let el: HTMLDivElement | null = $state(null)
  $effect(() => {
    ref = el
    sub?.setTriggerEl(el)
  })
  $effect(() => {
    if (el && parentScope) {
      const isDisabled = () => disabled
      return parentScope.registerItem(el, isDisabled)
    }
  })

  const isOpen = $derived(sub?.isOpen() ?? false)
</script>

<div
  bind:this={el}
  role="menuitem"
  tabindex="-1"
  aria-haspopup="menu"
  aria-expanded={isOpen}
  aria-disabled={disabled || undefined}
  data-uipkge=""
  data-slot="menubar-sub-trigger"
  data-state={isOpen ? 'open' : 'closed'}
  data-inset={inset ? '' : undefined}
  data-disabled={disabled ? '' : undefined}
  class={cn(
    'focus:bg-accent focus:text-accent-foreground focus-visible:ring-ring data-[state=open]:bg-accent data-[state=open]:text-accent-foreground flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-none select-none focus-visible:ring-2 focus-visible:ring-inset data-[inset]:pl-8',
    className,
  )}
  onclick={(e) => {
    if (disabled) return
    sub?.setOpen(!isOpen)
    onclick?.(e)
  }}
  onmouseenter={(e) => {
    if (disabled) return
    ;(e.currentTarget as HTMLElement).focus({ preventScroll: true })
    sub?.setOpen(true)
  }}
  onkeydown={(e) => {
    const target = e.currentTarget as HTMLElement
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      parentScope?.moveFocus(target, 1)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      parentScope?.moveFocus(target, -1)
    } else if (e.key === 'Home') {
      e.preventDefault()
      parentScope?.moveFocus(target, 'first')
    } else if (e.key === 'End') {
      e.preventDefault()
      parentScope?.moveFocus(target, 'last')
    } else if (e.key === 'ArrowRight' || e.key === 'Enter' || e.key === ' ') {
      if (!disabled) {
        e.preventDefault()
        sub?.setOpen(true)
        tick().then(() => subScope?.moveFocus(null, 'first'))
      }
    }
    onkeydown?.(e)
  }}
  {...restProps}
>
  {@render children?.()}
  <ChevronRight class="ml-auto size-4" aria-hidden="true" />
</div>

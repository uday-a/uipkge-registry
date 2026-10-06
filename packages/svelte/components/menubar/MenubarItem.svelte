<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface MenubarItemProps extends HTMLAttributes<HTMLDivElement> {
    disabled?: boolean
    inset?: boolean
    variant?: 'default' | 'destructive'
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'
  import { getMenubarRootContext, getMenubarScopeContext } from './MenubarContext'

  let {
    class: className,
    disabled = false,
    inset = false,
    variant = 'default',
    children,
    ref = $bindable(null),
    onclick,
    onkeydown,
    ...restProps
  }: MenubarItemProps = $props()

  const root = getMenubarRootContext()
  const scope = getMenubarScopeContext()

  let el: HTMLDivElement | null = $state(null)
  $effect(() => {
    ref = el
  })
  $effect(() => {
    if (el && scope) {
      const isDisabled = () => disabled
      return scope.registerItem(el, isDisabled)
    }
  })
</script>

<div
  bind:this={el}
  role="menuitem"
  tabindex="-1"
  aria-disabled={disabled || undefined}
  data-uipkge=""
  data-slot="menubar-item"
  data-inset={inset ? '' : undefined}
  data-variant={variant}
  data-disabled={disabled ? '' : undefined}
  class={cn(
    "focus:bg-accent focus:text-accent-foreground focus-visible:ring-ring data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/40 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none focus-visible:ring-2 focus-visible:ring-inset data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    className,
  )}
  onclick={(e) => {
    if (disabled) return
    onclick?.(e)
    // Plain items select + close; sub scopes bubble the close to the root.
    scope?.closeScope(false)
    root?.setOpenMenu(null)
  }}
  onmouseenter={(e) => {
    if (!disabled) (e.currentTarget as HTMLElement).focus({ preventScroll: true })
  }}
  onkeydown={(e) => {
    const target = e.currentTarget as HTMLElement
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      scope?.moveFocus(target, 1)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      scope?.moveFocus(target, -1)
    } else if (e.key === 'Home') {
      e.preventDefault()
      scope?.moveFocus(target, 'first')
    } else if (e.key === 'End') {
      e.preventDefault()
      scope?.moveFocus(target, 'last')
    } else if (e.key === 'Enter' || e.key === ' ') {
      if (!disabled) {
        e.preventDefault()
        target.click()
      }
    }
    onkeydown?.(e)
  }}
  {...restProps}
>
  {@render children?.()}
</div>
